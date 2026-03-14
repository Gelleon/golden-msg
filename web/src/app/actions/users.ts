"use server"

import { revalidatePath } from "next/cache"
import { hash } from "bcryptjs"
import prisma from "@/lib/db"
import { getSession } from "./auth"

export async function getUsers() {
  const session = await getSession()
  if (!session?.user) return []

  // Check if user is admin
  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (currentUser?.role !== "admin") {
    return []
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        email: true,
        full_name: true,
        role: true,
        preferred_language: true,
        avatar_url: true,
        created_at: true,
      },
    })
    return users.map(user => ({
      ...user,
      created_at: user.created_at.toISOString()
    }))
  } catch (error) {
    console.error("Get users error:", error)
    return []
  }
}

export async function updateUserRole(userId: string, newRole: string) {
  const session = await getSession()
  if (!session?.user) return { error: "Unauthorized" }

  // Check if user is admin
  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (currentUser?.role !== "admin") {
    return { error: "Permission denied" }
  }

  const validRoles = ["admin", "manager", "partner", "client"]
  if (!validRoles.includes(newRole)) {
    return { error: "Invalid role" }
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    })

    revalidatePath("/dashboard/users")
    return { success: true }
  } catch (error) {
    console.error("Update user role error:", error)
    return { error: "Failed to update role" }
  }
}

export async function updateProfile(formData: FormData) {
  const session = await getSession()
  if (!session?.user) return { error: "Unauthorized" }

  const fullName = formData.get("fullName") as string
  const language = formData.get("language") as string
  const password = formData.get("password") as string
  const avatarUrl = formData.get("avatarUrl") as string

  const data: any = {}
  if (fullName) data.full_name = fullName
  if (language) data.preferred_language = language
  if (avatarUrl) data.avatar_url = avatarUrl
  if (password) {
    if (password.length < 6) return { error: "Password must be at least 6 characters" }
    data.password_hash = await hash(password, 10)
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data,
    })
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Update profile error:", error)
    return { error: "Failed to update profile" }
  }
}
