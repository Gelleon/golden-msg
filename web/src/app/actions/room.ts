"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/db"
import { getSession } from "./auth"
import { randomBytes } from "crypto"
import { headers } from "next/headers"
import { ensureSchemaFixed } from "@/lib/schema-fix"

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

    const roomsWithCounts = await Promise.all(rooms.map(async (room) => {
      const lastReadAt = room.participants[0]?.last_read_at || new Date(0)
      const unreadCount = await prisma.message.count({
        where: {
          room_id: room.id,
          created_at: { gt: lastReadAt },
          sender_id: { not: session.user.id }
        }
      })

      return {
        id: room.id,
        name: room.name,
        type: room.type,
        created_at: room.created_at.toISOString(),
        unreadCount,
        lastReadAt: lastReadAt.toISOString()
      }
    }))

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
    return { error: "Failed to create room" }
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
    const processedDMs = await Promise.all(dms.map(async (dm) => {
      const otherParticipant = dm.participants.find(
        (p) => p.user_id !== session.user.id
      )
      const currentParticipant = dm.participants.find(
        (p) => p.user_id === session.user.id
      )
      
      const lastReadAt = currentParticipant?.last_read_at || new Date(0)
      const unreadCount = await prisma.message.count({
        where: {
          room_id: dm.id,
          created_at: { gt: lastReadAt },
          sender_id: { not: session.user.id }
        }
      })

      return {
        id: dm.id,
        name: dm.name,
        type: dm.type,
        created_by: dm.created_by,
        created_at: dm.created_at.toISOString(),
        unreadCount,
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
        } : undefined,
      }
    }))

    return processedDMs
  } catch (error) {
    console.error("Get DMs error:", error)
    return []
  }
}

export async function searchUsers(query: string) {
  const session = await getSession()
  if (!session?.user) return []

  if (!query.trim()) return []

  try {
    const users = await prisma.user.findMany({
      where: {
        full_name: {
          contains: query,
        },
        id: {
          not: session.user.id,
        },
        role: {
          not: "client", // Clients excluded from DMs? Or maybe just can't initiate?
          // User requirement: "Private chat... excluding Clients"
          // This implies clients cannot participate in private chats.
        },
      },
      take: 10,
      select: {
        id: true,
        full_name: true,
        avatar_url: true,
        role: true,
        created_at: true,
        // @ts-ignore
        // preferred_language: true,
      }
    })
    return users.map(user => ({
      ...user,
      // @ts-ignore
      preferred_language: user.preferred_language || "ru",
      created_at: user.created_at.toISOString()
    }))
  } catch (error) {
    console.error("Search users error:", error)
    return []
  }
}

export async function startDM(otherUserId: string) {
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
    return { error: "Cannot chat with client" }
  }

  try {
    // Check if DM already exists
    const existingDM = await prisma.room.findFirst({
      where: {
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
      },
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
        name: "DM", // Placeholder
        created_by: session.user.id,
        type: "private",
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
    return { error: "Failed to start DM" }
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
  
  const canManage = ["admin", "manager"].includes(currentUser?.role || "")
  if (!canManage) return { error: "Permission denied" }

  // If Manager, check if they are inviting only Client or Partner
  if (currentUser?.role === "manager") {
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    })

    if (!["client", "partner"].includes(targetUser?.role || "")) {
      return { error: "Managers can only invite Clients and Partners" }
    }
  }

  try {
    await prisma.roomParticipant.create({
      data: {
        room_id: roomId,
        user_id: userId,
      },
    })
    revalidatePath(`/dashboard/rooms/${roomId}`)
    return { success: true }
  } catch (error) {
    console.error("Add participant error:", error)
    return { error: "Failed to add participant" }
  }
}

export async function removeParticipant(roomId: string, userId: string) {
  const session = await getSession()
  if (!session?.user) return { error: "Unauthorized" }

  // Check permissions (Admin or Manager)
  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })
  
  const canManage = ["admin", "manager"].includes(currentUser?.role || "")
  if (!canManage) return { error: "Permission denied" }

  try {
    await prisma.roomParticipant.delete({
      where: {
        room_id_user_id: {
          room_id: roomId,
          user_id: userId,
        },
      },
    })
    revalidatePath(`/dashboard/rooms/${roomId}`)
    return { success: true }
  } catch (error) {
    console.error("Remove participant error:", error)
    return { error: "Failed to remove participant" }
  }
}

export async function searchUsersForRoom(query: string) {
  const session = await getSession()
  if (!session?.user) return []

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })

  const roleFilter: any = {}
  if (currentUser?.role === "manager") {
    roleFilter.role = { in: ["client", "partner"] }
  }

  const where: any = {
    id: {
      not: session.user.id,
    },
    ...roleFilter,
  }

  if (query.trim()) {
    where.full_name = {
      contains: query,
    }
  }

  try {
    const users = await prisma.user.findMany({
      where,
      take: query.trim() ? 10 : 50,
      select: {
        id: true,
        full_name: true,
        avatar_url: true,
        role: true,
      },
      orderBy: {
        full_name: "asc",
      },
    })
    return users
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
  
  if (currentUser?.role !== "admin") {
    return { error: "Permission denied. Only admins can delete rooms." }
  }

  try {
    await prisma.room.delete({
      where: { id: roomId },
    })

    // Log the action
    console.log(`[LOG] Admin ${session.user.id} deleted room ${roomId}`)

    revalidatePath("/dashboard")
    
    return { success: true }
  } catch (error) {
    console.error("Delete room error:", error)
    return { error: "Failed to delete room" }
  }
}
