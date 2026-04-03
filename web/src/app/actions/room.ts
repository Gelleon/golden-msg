/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/db"
import { getSession } from "./auth"
import { randomBytes } from "crypto"
import { headers } from "next/headers"
import { ensureSchemaFixed } from "@/lib/schema-fix"
import { sendSSEUpdate } from "@/lib/sse"

export async function createRoomInvite(roomId: string, role: "client" | "partner", maxUses: number = 1) {
  await ensureSchemaFixed()
  console.log(`[SERVER] Creating invite for room ${roomId}, role ${role}`)
  const session = await getSession()
  if (!session?.user) {
    console.error("[SERVER] No session found")
    return { error: "Unauthorized" }
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true },
  })

  console.log(`[SERVER] Current user: ${currentUser?.id}, role: ${currentUser?.role}`)

  if (!["admin", "manager"].includes(currentUser?.role || "")) {
    console.error("[SERVER] Permission denied for role:", currentUser?.role)
    return { error: "Permission denied" }
  }

  // Check if room exists
  const room = await prisma.room.findUnique({
    where: { id: roomId },
  })

  if (!room) {
    console.error("[SERVER] Room not found:", roomId)
    return { error: "Room not found" }
  }

  try {
      const token = randomBytes(16).toString("hex")
      const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24) // 24 hours expiry

    const invite = await prisma.roomInvite.create({
      data: {
        token,
        room_id: roomId,
        created_by: session.user.id,
        role,
        expires_at: expiresAt,
        max_uses: maxUses,
      },
    })

    // Log the action
    console.log(`[LOG] User ${session.user.id} (${currentUser?.role}) created an invite for room ${roomId} with role ${role}. Token: ${token}`)

    // Dynamically determine domain
    const host = (await headers()).get("host")
    const protocol = host?.includes("localhost") ? "http" : "https"
    const domain = host ? `${protocol}://${host}` : (process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000")
    
    const inviteUrl = `${domain}/invite/${roomId}/${token}`

    return { success: true, inviteUrl }
  } catch (error: any) {
    console.error("[SERVER] Create room invite error:", error)
    // Return more specific error message for debugging
    return { error: `Failed to create invite: ${error.message || "Unknown error"}` }
  }
}

export async function acceptRoomInvite(roomId: string, token: string) {
  const session = await getSession()
  if (!session?.user) return { error: "Unauthorized" }

  try {
    const invite = await prisma.roomInvite.findUnique({
      where: { token },
      include: { room: true },
    })

    if (!invite || invite.room_id !== roomId) {
      return { error: "Invalid invite link" }
    }

    if (new Date() > invite.expires_at) {
      return { error: "Invite link has expired" }
    }

    if (invite.uses >= invite.max_uses) {
      return { error: "Invite link has reached maximum uses" }
    }

    // Update invite uses
    await prisma.roomInvite.update({
      where: { id: invite.id },
      data: { uses: { increment: 1 } },
    })

    // Add user to room
    const existingParticipant = await prisma.roomParticipant.findUnique({
      where: {
        room_id_user_id: {
          room_id: roomId,
          user_id: session.user.id,
        },
      },
    })

    if (!existingParticipant) {
      await prisma.roomParticipant.create({
        data: {
          room_id: roomId,
          user_id: session.user.id,
          role: "member",
        },
      })
    }

    // Update user role if it's currently lower than the invite role
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    // Role hierarchy logic (optional, but requested: "role for the invited user")
    // If the invite is for 'partner' and current user is 'client', upgrade to 'partner'
    if (invite.role === "partner" && currentUser?.role === "client") {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { role: "partner" },
      })
    } else if (invite.role === "client" && !currentUser?.role) {
       // If user has no role, set to client
       await prisma.user.update({
        where: { id: session.user.id },
        data: { role: "client" },
      })
    }

    // Log the action
    console.log(`[LOG] User ${session.user.id} accepted invite ${token} for room ${roomId}. Role assigned: ${invite.role}`)

    revalidatePath("/dashboard")
    revalidatePath(`/dashboard/rooms/${roomId}`)

    return { success: true, roomId }
  } catch (error) {
    console.error("Accept room invite error:", error)
    return { error: "Failed to accept invite" }
  }
}

export async function getRooms() {
  await ensureSchemaFixed()
  const session = await getSession()
  if (!session?.user) return []

  try {
    const rooms = await prisma.room.findMany({
      where: {
        type: "group",
        participants: {
          some: {
            user_id: session.user.id,
          },
        },
      },
      include: {
        participants: {
          where: { user_id: session.user.id },
          select: { last_read_at: true }
        },
        _count: {
          select: {
            messages: {
              where: {
                created_at: {
                  gt: new Date() // Placeholder, will be adjusted below
                }
              }
            }
          }
        }
      },
      orderBy: { created_at: "desc" },
    })

    const roomIds = rooms.map(r => r.id)
    let unreadCounts: Record<string, number> = {}

    if (roomIds.length > 0) {
      const minLastReadAt = new Date(Math.min(...rooms.map(r => (r.participants[0]?.last_read_at || new Date(0)).getTime())))
      
      const unreadMessages = await prisma.message.findMany({
        where: {
          room_id: { in: roomIds },
          sender_id: { not: session.user.id },
          created_at: { gt: minLastReadAt }
        },
        select: {
          room_id: true,
          created_at: true
        }
      })

      unreadCounts = rooms.reduce((acc, room) => {
        const lastReadAt = room.participants[0]?.last_read_at || new Date(0)
        acc[room.id] = unreadMessages.filter(m => m.room_id === room.id && m.created_at > lastReadAt).length
        return acc
      }, {} as Record<string, number>)
    }

    const roomsWithCounts = rooms.map(room => {
      const lastReadAt = room.participants[0]?.last_read_at || new Date(0)

      return {
        id: room.id,
        name: room.name,
        type: room.type,
        description: room.description || null,
        created_at: room.created_at.toISOString(),
        unreadCount: unreadCounts[room.id] || 0,
        lastReadAt: lastReadAt.toISOString()
      }
    })

    return roomsWithCounts
  } catch (error) {
    console.error("Get rooms error:", error)
    return []
  }
}

export async function createRoom(name: string) {
  const session = await getSession()
  if (!session?.user) return { error: "Unauthorized" }

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })
  
  if (!["admin", "manager"].includes(currentUser?.role || "")) {
    return { error: "Permission denied" }
  }

  if (!name.trim()) return { error: "Name is required" }

  try {
    const room = await prisma.room.create({
      data: {
        name,
        created_by: session.user.id,
        type: "group",
        participants: {
          create: {
            user_id: session.user.id,
          },
        },
      },
    })

    revalidatePath("/dashboard")
    return { 
      success: true, 
      room: {
        ...room,
        created_at: room.created_at.toISOString()
      } 
    }
  } catch (error) {
    console.error("Create room error:", error)
    return { error: "Failed to create room", details: error instanceof Error ? error.message : String(error) }
  }
}

export async function getDMs() {
  const session = await getSession()
  if (!session?.user) return []

  try {
    const dms = await prisma.room.findMany({
      where: {
        type: "private",
        participants: {
          some: {
            user_id: session.user.id,
          },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                full_name: true,
                avatar_url: true,
                role: true,
                created_at: true,
                // @ts-ignore
                // preferred_language: true, 
              }
            },
          },
        },
      },
      orderBy: { created_at: "desc" },
    })

    // Process DMs to find the other user and count unread
    const dmIds = dms.map(d => d.id)
    let unreadCounts: Record<string, number> = {}

    if (dmIds.length > 0) {
      const currentParticipants = dms.map(dm => dm.participants.find(p => p.user_id === session.user.id))
      const minLastReadAt = new Date(Math.min(...currentParticipants.map(p => (p?.last_read_at || new Date(0)).getTime())))

      const unreadMessages = await prisma.message.findMany({
        where: {
          room_id: { in: dmIds },
          sender_id: { not: session.user.id },
          created_at: { gt: minLastReadAt }
        },
        select: {
          room_id: true,
          created_at: true
        }
      })

      unreadCounts = dms.reduce((acc, dm) => {
        const currentParticipant = dm.participants.find(p => p.user_id === session.user.id)
        const lastReadAt = currentParticipant?.last_read_at || new Date(0)
        acc[dm.id] = unreadMessages.filter(m => m.room_id === dm.id && m.created_at > lastReadAt).length
        return acc
      }, {} as Record<string, number>)
    }

    // Fetch shared rooms for each DM
    const sharedRoomsPromises = dms.map(async (dm) => {
      const otherParticipant = dm.participants.find(p => p.user_id !== session.user.id);
      if (!otherParticipant) return { dmId: dm.id, sharedRoomName: null };
      
      // Find shared rooms
      const sharedRooms = await prisma.room.findMany({
        where: {
          type: 'group',
          AND: [
            { participants: { some: { user_id: session.user.id } } },
            { participants: { some: { user_id: otherParticipant.user_id } } }
          ]
        },
        select: { name: true }
      });
      
      const sharedRoomNames = sharedRooms.map(r => r.name).filter(Boolean);
      return { 
        dmId: dm.id, 
        sharedRoomName: sharedRoomNames.length > 0 ? sharedRoomNames.join(', ') : null 
      };
    });
    
    const sharedRoomsResults = await Promise.all(sharedRoomsPromises);
    const sharedRoomsMap = sharedRoomsResults.reduce((acc, result) => {
      acc[result.dmId] = result.sharedRoomName;
      return acc;
    }, {} as Record<string, string | null>);

    // Fetch parent rooms for each DM
    const parentRoomIds = dms.map(dm => dm.room_id).filter(Boolean) as string[]
    let parentRoomsMap: Record<string, string> = {}
    if (parentRoomIds.length > 0) {
      const parentRooms = await prisma.room.findMany({
        where: { id: { in: parentRoomIds } },
        select: { id: true, name: true }
      })
      parentRoomsMap = parentRooms.reduce((acc, r) => {
        if (r.name) acc[r.id] = r.name
        return acc
      }, {} as Record<string, string>)
    }

    const processedDMs = dms.map(dm => {
      const otherParticipant = dm.participants.find(
        (p) => p.user_id !== session.user.id
      )
      const currentParticipant = dm.participants.find(
        (p) => p.user_id === session.user.id
      )
      
      const lastReadAt = currentParticipant?.last_read_at || new Date(0)
      const unreadCount = unreadCounts[dm.id] || 0

      return {
        id: dm.id,
        room_id: dm.room_id,
        name: dm.name,
        type: dm.type,
        description: dm.description || null,
        created_by: dm.created_by,
        created_at: dm.created_at.toISOString(),
        unreadCount,
        sharedRoomName: sharedRoomsMap[dm.id] || null,
        parentRoomName: dm.room_id ? (parentRoomsMap[dm.room_id] || null) : null,
        lastReadAt: lastReadAt.toISOString(),
        otherUser: otherParticipant?.user ? {
          id: otherParticipant.user.id,
          email: otherParticipant.user.email,
          full_name: otherParticipant.user.full_name,
          avatar_url: otherParticipant.user.avatar_url,
          role: otherParticipant.user.role,
          // @ts-ignore
          preferred_language: otherParticipant.user.preferred_language || "ru",
          created_at: otherParticipant.user.created_at.toISOString()
        } : null,
      }
    })

    return processedDMs
  } catch (error) {
    console.error("Get DMs error:", error)
    return []
  }
}

export async function searchUsers(query: string = "") {
  console.log("[SERVER] searchUsers called with query:", query);
  const session = await getSession()
  if (!session?.user) {
    console.log("[SERVER] searchUsers: no session user")
    return []
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })

  // We want to be able to find users to add them to a room/DM.
  // Allow fetching any active user other than self, depending on use-case we can filter later, 
  // but for basic search let's just return all users except self.
  const whereClause: any = {
    id: {
      not: session.user.id,
    }
  }

  try {
    console.log("[SERVER] searchUsers query:", query);
    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        email: true,
        full_name: true,
        avatar_url: true,
        role: true,
        created_at: true,
        preferred_language: true,
      }
    })
    
    console.log("[SERVER] searchUsers found users:", users.length);

    let filteredUsers = users;
    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      filteredUsers = users.filter(u => 
        (u.full_name && u.full_name.toLowerCase().includes(q)) || 
        (u.email && u.email.toLowerCase().includes(q))
      );
    }
    
    const finalUsers = filteredUsers.slice(0, 50); // Always return up to 50 users

    // Fetch shared rooms for each user
    const usersWithSharedRooms = await Promise.all(finalUsers.map(async (user) => {
      const sharedRooms = await prisma.room.findMany({
        where: {
          type: 'group',
          AND: [
            { participants: { some: { user_id: session.user.id } } },
            { participants: { some: { user_id: user.id } } }
          ]
        },
        select: { name: true }
      });
      return {
        ...user,
        preferred_language: user.preferred_language || "ru",
        created_at: user.created_at.toISOString(),
        sharedRoomName: sharedRooms.map(r => r.name).filter(Boolean).join(', ') || null
      };
    }));

    return usersWithSharedRooms;
  } catch (error) {
    console.error("Search users error:", error)
    return []
  }
}

export async function startDM(otherUserId: string, roomId?: string | null) {
  const session = await getSession()
  if (!session?.user) return { error: "Unauthorized" }

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })

  if (currentUser?.role === "client") {
    return { error: "Clients cannot use private chat" }
  }

  const otherUser = await prisma.user.findUnique({
    where: { id: otherUserId },
    select: { role: true },
  })

  if (otherUser?.role === "client") {
    return { error: "Cannot start private chat with a client" }
  }

  try {
    // Check if DM already exists between these two users in the same room context
    const existingDMCondition: any = {
      type: "private",
      AND: [
        {
          participants: {
            some: {
              user_id: session.user.id,
            },
          },
        },
        {
          participants: {
            some: {
              user_id: otherUserId,
            },
          },
        },
      ],
      ...(roomId && { room_id: roomId }),
    }

    const existingDM = await prisma.room.findFirst({
      where: existingDMCondition,
    })

    if (existingDM) {
      return { 
        success: true, 
        room: {
          ...existingDM,
          created_at: existingDM.created_at.toISOString()
        } 
      }
    }

    // Create new DM room
    const room = await prisma.room.create({
      data: {
        name: "DM",
        created_by: session.user.id,
        type: "private",
        room_id: roomId,
        participants: {
          create: [
            { user_id: session.user.id },
            { user_id: otherUserId },
          ],
        },
      },
    })

    revalidatePath("/dashboard")
    return { 
      success: true, 
      room: {
        ...room,
        created_at: room.created_at.toISOString()
      } 
    }
  } catch (error) {
    console.error("Start DM error:", error)
    return { error: "Failed to start DM", details: error instanceof Error ? error.message : String(error) }
  }
}

export async function getRoomDetails(roomId: string) {
  const session = await getSession()
  if (!session?.user) return null

  try {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      select: { created_by: true, type: true }
    })

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, role: true }
    })

    const participants = await prisma.roomParticipant.findMany({
      where: { room_id: roomId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            full_name: true,
            avatar_url: true,
            role: true,
          },
        },
      },
      orderBy: {
        joined_at: 'asc'
      }
    })

    const mappedParticipants = participants.map((p) => ({
      ...p.user,
      room_role: p.role, // "owner", "admin", "member"
      joined_at: p.joined_at.toISOString(),
    }))

    return {
      room,
      currentUser,
      participants: mappedParticipants
    }
  } catch (error) {
    console.error("Get room info details error:", error)
    return null
  }
}

export async function getRoomDescription(roomId: string) {
  const session = await getSession()
  if (!session?.user) return { error: "Unauthorized" }

  try {
    const room = await prisma.room.findFirst({
      where: {
        id: roomId,
        participants: {
          some: {
            user_id: session.user.id,
          },
        },
      },
      select: {
        description: true,
      },
    })

    if (!room) {
      return { error: "Room not found" }
    }

    return {
      description: room.description,
    }
  } catch (error) {
    console.error("Get room description error:", error)
    return { error: "Failed to load room description" }
  }
}

export async function updateParticipantRole(roomId: string, userId: string, newRole: string) {
  const session = await getSession()
  if (!session?.user) return { error: "Unauthorized" }

  // Check permissions
  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })
  
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    select: { created_by: true }
  })

  const currentParticipant = await prisma.roomParticipant.findUnique({
    where: { room_id_user_id: { room_id: roomId, user_id: session.user.id } }
  })

  const isCreator = room?.created_by === session.user.id
  const isGlobalAdminOrManager = ["admin", "manager"].includes(currentUser?.role || "")
  const isRoomAdmin = currentParticipant?.role === "admin" || currentParticipant?.role === "owner"

  if (!isCreator && !isGlobalAdminOrManager && !isRoomAdmin) {
    return { error: "Permission denied" }
  }

  // Cannot change creator's role
  if (room?.created_by === userId) {
    return { error: "Cannot change creator's role" }
  }

  try {
    await prisma.roomParticipant.update({
      where: {
        room_id_user_id: {
          room_id: roomId,
          user_id: userId
        }
      },
      data: {
        role: newRole
      }
    })

    sendSSEUpdate(roomId, {
      type: "participant_updated",
      userId,
      role: newRole
    })

    revalidatePath(`/dashboard/rooms/${roomId}`)
    return { success: true }
  } catch (error) {
    console.error("Update participant role error:", error)
    return { error: "Failed to update role" }
  }
}

export async function removeParticipant(roomId: string, userId: string) {
  const session = await getSession()
  if (!session?.user) return { error: "Unauthorized" }

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })
  
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    select: { created_by: true }
  })

  const currentParticipant = await prisma.roomParticipant.findUnique({
    where: { room_id_user_id: { room_id: roomId, user_id: session.user.id } }
  })

  const isSelf = session.user.id === userId
  const isCreator = room?.created_by === session.user.id
  const isGlobalAdminOrManager = ["admin", "manager"].includes(currentUser?.role || "")
  const isRoomAdmin = currentParticipant?.role === "admin" || currentParticipant?.role === "owner"

  if (!isSelf && !isCreator && !isGlobalAdminOrManager && !isRoomAdmin) {
    return { error: "Permission denied" }
  }

  // Cannot remove creator
  if (room?.created_by === userId) {
    return { error: "Cannot remove room creator" }
  }

  try {
    await prisma.roomParticipant.delete({
      where: {
        room_id_user_id: {
          room_id: roomId,
          user_id: userId
        }
      }
    })

    sendSSEUpdate(roomId, {
      type: "participant_removed",
      userId
    })

    revalidatePath(`/dashboard/rooms/${roomId}`)
    return { success: true }
  } catch (error) {
    console.error("Remove participant error:", error)
    return { error: "Failed to remove participant" }
  }
}

export async function getRoomParticipants(roomId: string) {
  const session = await getSession()
  if (!session?.user) return []

  try {
    const participants = await prisma.roomParticipant.findMany({
      where: { room_id: roomId },
      include: {
        user: {
          select: {
            id: true,
            full_name: true,
            avatar_url: true,
            role: true,
            // @ts-ignore
            // preferred_language: true,
          },
        },
      },
    })
    // Map to profile structure expected by UI
    return participants.map((p) => ({
      ...p.user,
      // @ts-ignore
      preferred_language: p.user.preferred_language || "ru",
      joined_at: p.joined_at.toISOString(),
    }))
  } catch (error) {
    console.error("Get participants error:", error)
    return []
  }
}

export async function addParticipant(roomId: string, userId: string) {
  const session = await getSession()
  if (!session?.user) return { error: "Unauthorized" }

  // Check permissions (Admin or Manager)
  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })
  
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    select: { created_by: true, type: true }
  })

  const isCreator = room?.created_by === session.user.id
  const canManage = ["admin", "manager"].includes(currentUser?.role || "") || isCreator
  if (!canManage) return { error: "Permission denied" }

  // If Manager (and not creator), check if they are inviting only Client or Partner
  if (currentUser?.role === "manager" && !isCreator) {
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    })

    if (!["client", "partner"].includes(targetUser?.role || "")) {
      return { error: "Managers can only invite Clients and Partners" }
    }
  }

  try {
    const newParticipant = await prisma.roomParticipant.create({
      data: {
        room_id: roomId,
        user_id: userId,
      },
      include: {
        user: {
          select: {
            id: true,
            full_name: true,
            avatar_url: true,
            role: true,
          }
        }
      }
    })

    // Map to profile structure expected by UI
    const participantData = {
      ...newParticipant.user,
      joined_at: newParticipant.joined_at.toISOString(),
    }

    sendSSEUpdate(roomId, {
      type: "participant_added",
      participant: participantData
    })

    revalidatePath(`/dashboard/rooms/${roomId}`)
    return { success: true }
  } catch (error) {
    console.error("Add participant error:", error)
    return { error: "Failed to add participant" }
  }
}


export async function updateUserPresence(roomId: string, status: "online" | "offline") {
  const session = await getSession()
  if (!session?.user) return { error: "Unauthorized" }

  sendSSEUpdate(roomId, {
    type: "presence",
    userId: session.user.id,
    status
  })

  return { success: true }
}

export async function searchUsersForRoomPaginated(roomId: string, query: string = "", page: number = 1, limit: number = 10) {
  const session = await getSession()
  if (!session?.user) return { users: [], total: 0 }

  // Exclude users already in the room
  const participants = await prisma.roomParticipant.findMany({
    where: { room_id: roomId },
    select: { user_id: true }
  })
  const existingUserIds = participants.map(p => p.user_id)
  existingUserIds.push(session.user.id) // also exclude current user if we want, or keep it. Let's exclude current user.

  const where: any = {
    id: {
      notIn: existingUserIds,
    }
  }

  if (query && query.trim()) {
    where.OR = [
      { full_name: { contains: query.trim(), mode: 'insensitive' } },
      { email: { contains: query.trim(), mode: 'insensitive' } }
    ]
  }

  try {
    const total = await prisma.user.count({ where })
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        full_name: true,
        email: true,
        avatar_url: true,
        role: true,
      },
      orderBy: {
        full_name: "asc",
      },
      skip: (page - 1) * limit,
      take: limit,
    })
    
    return { users, total }
  } catch (error) {
    console.error("Search users paginated error:", error)
    return { users: [], total: 0 }
  }
}

export async function searchUsersForRoom(query: string = "") {
  const session = await getSession()
  if (!session?.user) return []

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })

  const roleFilter: any = {}

  const where: any = {
    id: {
      not: session.user.id,
    },
    ...roleFilter,
  }

  try {
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        full_name: true,
        email: true,
        avatar_url: true,
        role: true,
      },
      orderBy: {
        full_name: "asc",
      },
    })
    
    let filteredUsers = users;
    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      filteredUsers = users.filter(u => 
        (u.full_name && u.full_name.toLowerCase().includes(q)) || 
        (u.email && u.email.toLowerCase().includes(q))
      );
    }
    
    return filteredUsers.slice(0, 50); // Always return up to 50 users, regardless of query
  } catch (error) {
    console.error("Search users for room error:", error)
    return []
  }
}

export async function updateRoom(roomId: string, data: { 
  name?: string, 
  description?: string, 
  capacity?: number, 
  equipment?: string 
}) {
  const session = await getSession()
  if (!session?.user) return { error: "Unauthorized" }

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })
  
  if (!["admin", "manager"].includes(currentUser?.role || "")) {
    return { error: "Permission denied" }
  }

  try {
    const room = await prisma.room.update({
      where: { id: roomId },
      data: {
        name: data.name,
        description: data.description,
        capacity: data.capacity,
        equipment: data.equipment,
      },
    })

    // Log the action
    console.log(`[LOG] User ${session.user.id} (${currentUser?.role}) updated room ${roomId}. Changes:`, data)

    revalidatePath("/dashboard")
    revalidatePath(`/dashboard/rooms/${roomId}`)
    
    return { 
      success: true, 
      room: {
        ...room,
        created_at: room.created_at.toISOString(),
        updated_at: room.updated_at.toISOString()
      } 
    }
  } catch (error) {
    console.error("Update room error:", error)
    return { error: "Failed to update room" }
  }
}

export async function deleteRoom(roomId: string) {
  const session = await getSession()
  if (!session?.user) return { error: "Unauthorized" }

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })
  
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    select: { type: true }
  })

  if (!room) {
    return { error: "Room not found" }
  }

  // Admins can delete any room. Managers can delete private chats (DMs).
  const canDelete = currentUser?.role === "admin" || (currentUser?.role === "manager" && room.type === "private");

  if (!canDelete) {
    return { error: "Permission denied. You cannot delete this chat/room." }
  }

  try {
    await prisma.room.delete({
      where: { id: roomId },
    })

    // Log the action
    console.log(`[LOG] User ${session.user.id} (${currentUser?.role}) deleted room ${roomId} (type: ${room.type})`)

    revalidatePath("/dashboard")
    
    return { success: true }
  } catch (error) {
    console.error("Delete room error:", error)
    return { error: "Failed to delete room" }
  }
}
