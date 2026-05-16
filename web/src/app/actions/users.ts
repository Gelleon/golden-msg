"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/db"
import { getSession } from "./auth"
import { ensureSchemaFixed } from "@/lib/schema-fix"

export async function getUsers() {
  const session = await getSession()
  if (!session?.user) return []

  if (!["admin", "manager"].includes(session.user.role || "")) {
    return []
  }

  try {
    await ensureSchemaFixed()
    const users = await prisma.user.findMany({
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        email: true,
        full_name: true,
        role: true,
        // @ts-ignore
        // preferred_language: true,
        avatar_url: true,
        created_at: true,
      },
    })
    return users.map(user => ({
      ...user,
      // @ts-ignore
      preferred_language: user.preferred_language || "ru",
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

  if (session.user.role !== "admin") {
    return { error: "Permission denied" }
  }

  const validRoles = ["admin", "manager", "partner", "client"]
  if (!validRoles.includes(newRole)) {
    return { error: "Invalid role" }
  }

  try {
    await ensureSchemaFixed()
    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    })

    revalidatePath("/dashboard/users")
    revalidatePath("/dashboard/settings")
    return { success: true }
  } catch (error) {
    console.error("Update user role error:", error)
    return { error: "Failed to update role" }
  }
}

const normalizeUserName = (value: unknown) => (typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "")

const validateUserName = (value: string) => {
  if (!value) return { ok: false as const, error: "Name cannot be empty" }
  if (value.length > 60) return { ok: false as const, error: "Name is too long" }
  if (/[\u0000-\u001F\u007F]/.test(value)) return { ok: false as const, error: "Invalid characters in name" }
  if (/[<>]/.test(value)) return { ok: false as const, error: "Invalid characters in name" }
  return { ok: true as const }
}

export async function updateUserName(userId: string, newFullName: string) {
  const session = await getSession()
  if (!session?.user) return { error: "Unauthorized" }

  if (!["admin", "manager"].includes(session.user.role || "")) {
    return { error: "Permission denied" }
  }

  const normalized = normalizeUserName(newFullName)
  const validation = validateUserName(normalized)
  if (!validation.ok) return { error: validation.error }

  try {
    await ensureSchemaFixed()

    const target = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, full_name: true, email: true, role: true },
    })
    if (!target) return { error: "User not found" }

    if ((target.full_name || "") === normalized) {
      return { success: true, user: { id: target.id, full_name: target.full_name } }
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { full_name: normalized },
      }),
      prisma.auditLog.create({
        data: {
          user_id: session.user.id,
          action: "user_name_changed",
          details: JSON.stringify({
            actor_id: session.user.id,
            actor_role: session.user.role,
            target_id: target.id,
            target_email: target.email,
            target_role: target.role,
            old_full_name: target.full_name,
            new_full_name: normalized,
          }),
        },
      }),
    ])

    revalidatePath("/dashboard/users")
    revalidatePath("/dashboard/settings")
    revalidatePath("/dashboard/rooms")

    return { success: true, user: { id: target.id, full_name: normalized } }
  } catch (error) {
    console.error("Update user name error:", error)
    return { error: "Failed to update name" }
  }
}

export async function updateProfile(formData: FormData) {
  const session = await getSession()
  if (!session?.user) return { error: "Unauthorized" }

  const fullName = formData.get("fullName") as string
  const language = formData.get("language") as string
  const password = formData.get("password") as string
  const avatarUrl = formData.get("avatarUrl") as string
  const emailNotifications = formData.get("emailNotifications")
  const pushNotifications = formData.get("pushNotifications")

  const data: any = {}
  if (fullName !== null) data.full_name = fullName
  // Try to add language safely
  if (language !== null) {
    try {
      data.preferred_language = language;
    } catch (e) {
      console.warn("Could not set preferred_language in updateProfile", e);
    }
  }
  if (avatarUrl !== null) data.avatar_url = avatarUrl
  if (emailNotifications !== null) data.email_notifications_enabled = emailNotifications === "true"
  if (pushNotifications !== null) data.push_notifications_enabled = pushNotifications === "true"
  if (password) {
    if (password.length < 6) return { error: "Password must be at least 6 characters" }
    const { hash } = await import("bcryptjs")
    data.password_hash = await hash(password, 10)
  }

  try {
    await ensureSchemaFixed()
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
