"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/db"
import { getSession } from "./auth"
import { ensureSchemaFixed } from "@/lib/schema-fix"
import bcrypt from "bcryptjs"
import crypto from "crypto"
import { sendEmail } from "@/lib/email"

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
        job_title_ru: true,
        job_title_cn: true,
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

function generateTemporaryPassword() {
  const lower = "abcdefghjkmnpqrstuvwxyz"
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ"
  const digits = "23456789"
  const symbols = "!@#$%^&*"
  const all = lower + upper + digits + symbols
  const chars = [
    lower[crypto.randomInt(lower.length)],
    upper[crypto.randomInt(upper.length)],
    digits[crypto.randomInt(digits.length)],
    symbols[crypto.randomInt(symbols.length)],
  ]

  while (chars.length < 14) {
    chars.push(all[crypto.randomInt(all.length)])
  }

  for (let i = chars.length - 1; i > 0; i--) {
    const j = crypto.randomInt(i + 1)
    ;[chars[i], chars[j]] = [chars[j], chars[i]]
  }

  return chars.join("")
}

function buildAdminPasswordResetEmail(password: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Новый пароль</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
        <h2 style="color: #0f172a; margin-top: 0; margin-bottom: 24px; font-size: 24px; font-weight: 700; text-align: center;">Golden Russia</h2>
        <p style="color: #334155; font-size: 16px; line-height: 24px; margin-bottom: 16px;">
          Администратор обновил ваш пароль для входа в Golden Russia.
        </p>
        <div style="background-color: #f1f5f9; padding: 18px; border-radius: 10px; margin: 24px 0;">
          <p style="color: #475569; font-size: 13px; line-height: 20px; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700;">
            Новый пароль
          </p>
          <code style="display: block; color: #0f172a; font-size: 22px; line-height: 32px; font-weight: 800; letter-spacing: 0.08em; word-break: break-all;">${password}</code>
        </div>
        <p style="color: #64748b; font-size: 14px; line-height: 20px; margin-bottom: 32px;">
          После входа рекомендуем сразу заменить пароль в настройках профиля.
        </p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 24px;">
        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
          GOLDEN RUSSIA &copy; ${new Date().getFullYear()}
        </p>
      </div>
    </body>
    </html>
  `
}

export async function adminResetUserPassword(userId: string) {
  const session = await getSession()
  if (!session?.user) return { error: "Unauthorized" }

  if (session.user.role !== "admin") {
    return { error: "Permission denied" }
  }

  if (session.user.id === userId) {
    return { error: "Cannot reset your own password here" }
  }

  try {
    await ensureSchemaFixed()

    const target = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true, password_hash: true },
    })
    if (!target) return { error: "User not found" }

    const newPassword = generateTemporaryPassword()
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    await prisma.user.update({
      where: { id: target.id },
      data: {
        password_hash: hashedPassword,
        last_password_reset_at: new Date(),
      },
    })

    const emailResult = await sendEmail({
      to: target.email,
      subject: "Golden Russia: новый пароль",
      html: buildAdminPasswordResetEmail(newPassword),
    })

    if (!emailResult.success) {
      await prisma.user.update({
        where: { id: target.id },
        data: { password_hash: target.password_hash },
      })
      return { error: emailResult.error || "Failed to send password email" }
    }

    await prisma.auditLog.create({
      data: {
        user_id: session.user.id,
        action: "admin_password_reset",
        details: JSON.stringify({
          actor_id: session.user.id,
          actor_role: session.user.role,
          target_id: target.id,
          target_email: target.email,
          target_role: target.role,
        }),
      },
    })

    revalidatePath("/dashboard/users")
    revalidatePath("/dashboard/settings")
    return { success: true }
  } catch (error) {
    console.error("Admin reset user password error:", error)
    return { error: "Failed to reset password" }
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

export async function updateUserName(userId: string, newFullName: string, jobTitleRu?: string, jobTitleCn?: string) {
  const session = await getSession()
  if (!session?.user) return { error: "Unauthorized" }

  if (!["admin", "manager"].includes(session.user.role || "")) {
    return { error: "Permission denied" }
  }

  const normalized = normalizeUserName(newFullName)
  const validation = validateUserName(normalized)
  if (!validation.ok) return { error: validation.error }

  const cleanJobTitleRu = typeof jobTitleRu === "string" ? jobTitleRu.trim() : null
  const cleanJobTitleCn = typeof jobTitleCn === "string" ? jobTitleCn.trim() : null

  try {
    await ensureSchemaFixed()

    const target = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, full_name: true, email: true, role: true, job_title_ru: true, job_title_cn: true },
    })
    if (!target) return { error: "User not found" }

    if ((target.full_name || "") === normalized && (target.job_title_ru || "") === (cleanJobTitleRu || "") && (target.job_title_cn || "") === (cleanJobTitleCn || "")) {
      return { success: true, user: { id: target.id, full_name: target.full_name, job_title_ru: target.job_title_ru, job_title_cn: target.job_title_cn } }
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { 
          full_name: normalized,
          job_title_ru: cleanJobTitleRu,
          job_title_cn: cleanJobTitleCn
        },
      }),
      prisma.auditLog.create({
        data: {
          user_id: session.user.id,
          action: "user_info_changed",
          details: JSON.stringify({
            actor_id: session.user.id,
            actor_role: session.user.role,
            target_id: target.id,
            target_email: target.email,
            target_role: target.role,
            old_full_name: target.full_name,
            new_full_name: normalized,
            old_job_title_ru: target.job_title_ru,
            new_job_title_ru: cleanJobTitleRu,
            old_job_title_cn: target.job_title_cn,
            new_job_title_cn: cleanJobTitleCn,
          }),
        },
      }),
    ])

    revalidatePath("/dashboard/users")
    revalidatePath("/dashboard/settings")
    revalidatePath("/dashboard/rooms")

    return { success: true, user: { id: target.id, full_name: normalized, job_title_ru: cleanJobTitleRu, job_title_cn: cleanJobTitleCn } }
  } catch (error) {
    console.error("Update user info error:", error)
    return { error: "Failed to update info" }
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

export async function deleteUser(userId: string) {
  const session = await getSession()
  if (!session?.user) return { error: "Unauthorized" }

  if (session.user.role !== "admin") {
    return { error: "Permission denied" }
  }

  if (session.user.id === userId) {
    return { error: "Cannot delete yourself" }
  }

  try {
    await ensureSchemaFixed()

    const target = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true },
    })

    if (!target) return { error: "User not found" }

    if (target.role === "admin") {
      const adminCount = await prisma.user.count({ where: { role: "admin" } })
      if (adminCount <= 1) {
        return { error: "Cannot delete last admin" }
      }
    }

    await prisma.$transaction([
      prisma.room.updateMany({
        where: { created_by: userId },
        data: { created_by: null },
      }),
      prisma.auditLog.updateMany({
        where: { user_id: userId },
        data: { user_id: null },
      }),
      prisma.message.updateMany({
        where: { reply_to: { sender_id: userId } },
        data: { reply_to_id: null },
      }),
      prisma.user.delete({ where: { id: userId } }),
      prisma.auditLog.create({
        data: {
          user_id: session.user.id,
          action: "user_deleted",
          details: JSON.stringify({
            actor_id: session.user.id,
            actor_role: session.user.role,
            target_id: target.id,
            target_email: target.email,
            target_role: target.role,
          }),
        },
      }),
    ])

    revalidatePath("/dashboard/settings")
    revalidatePath("/dashboard/users")
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Delete user error:", error)
    return { error: "Failed to delete user" }
  }
}
