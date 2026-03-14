"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/db"
import { getSession } from "./auth"

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
      orderBy: { created_at: "desc" },
    })
    return rooms.map(room => ({
      ...room,
      created_at: room.created_at.toISOString()
    }))
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
            user: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
    })

    // Process DMs to find the other user
    const processedDMs = dms.map((dm) => {
      const otherParticipant = dm.participants.find(
        (p) => p.user_id !== session.user.id
      )
      return {
        id: dm.id,
        name: dm.name,
        type: dm.type,
        created_by: dm.created_by,
        created_at: dm.created_at.toISOString(),
        otherUser: otherParticipant?.user ? {
          id: otherParticipant.user.id,
          email: otherParticipant.user.email,
          full_name: otherParticipant.user.full_name,
          avatar_url: otherParticipant.user.avatar_url,
          role: otherParticipant.user.role,
          preferred_language: otherParticipant.user.preferred_language,
          created_at: otherParticipant.user.created_at.toISOString()
        } : undefined,
      }
    })

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
    })
    return users.map(user => ({
      ...user,
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
  })

  if (currentUser?.role === "client") {
    return { error: "Clients cannot use private chat" }
  }

  const otherUser = await prisma.user.findUnique({
    where: { id: otherUserId },
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
          },
        },
      },
    })
    // Map to profile structure expected by UI
    return participants.map((p) => ({
      ...p.user,
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

  if (!query.trim()) return []

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })

  const roleFilter: any = {}
  if (currentUser?.role === "manager") {
    roleFilter.role = { in: ["client", "partner"] }
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        full_name: {
          contains: query,
        },
        id: {
          not: session.user.id,
        },
        ...roleFilter,
      },
      take: 10,
      select: {
        id: true,
        full_name: true,
        avatar_url: true,
        role: true,
      },
    })
    return users
  } catch (error) {
    console.error("Search users for room error:", error)
    return []
  }
}
