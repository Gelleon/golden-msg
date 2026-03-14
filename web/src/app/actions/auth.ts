"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import prisma from "@/lib/db"
import bcrypt from "bcryptjs"
import { z } from "zod"

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().optional(),
  language: z.enum(["ru", "cn"]).optional(),
})

export async function login(formData: FormData) {
  console.log("LOGIN ATTEMPT", formData.get("email"))
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Заполните все поля" }
  }

  try {
    console.log("FINDING USER", email)
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      console.log("USER NOT FOUND", email)
      return { error: "Пользователь не найден" }
    }

    console.log("COMPARING PASSWORD")
    const isValid = await bcrypt.compare(password, user.password_hash)

    if (!isValid) {
      console.log("INVALID PASSWORD")
      return { error: "Неверный пароль" }
    }

    // Set session cookie
    console.log("SETTING COOKIE", user.id)
    const cookieStore = await cookies()
    cookieStore.set("session_user_id", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    console.log("LOGIN SUCCESS")
    return { success: true }
  } catch (error: any) {
    console.error("Login error DETAILED:", error)
    return { error: `Ошибка входа: ${error.message || "Неизвестная ошибка"}` }
  }
}

export async function register(formData: FormData) {
  console.log("REGISTER ATTEMPT", formData.get("email"))
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const fullName = formData.get("fullName") as string
  const language = formData.get("language") as string

  // Manual validation because safeParse was failing on optional fields or types
  if (!email || !password || password.length < 6) {
    return { error: "Неверные данные" }
  }

  try {
    console.log("FINDING EXISTING USER", email)
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      console.log("USER ALREADY EXISTS", email)
      return { error: "Пользователь уже существует" }
    }

    console.log("HASHING PASSWORD")
    const hashedPassword = await bcrypt.hash(password, 10)

    // Check if it's the first user
    console.log("CHECKING USER COUNT")
    const userCount = await prisma.user.count()
    const role = userCount === 0 ? "admin" : "client"

    console.log("CREATING USER", email, role)
    const user = await prisma.user.create({
      data: {
        email,
        password_hash: hashedPassword,
        full_name: fullName,
        preferred_language: language || "ru",
        role: role,
      },
    })

    // Set session cookie
    console.log("SETTING COOKIE", user.id)
    const cookieStore = await cookies()
    cookieStore.set("session_user_id", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    console.log("REGISTRATION SUCCESS")
    return { success: true }
  } catch (error: any) {
    console.error("Registration error DETAILED:", error)
    return { error: `Ошибка регистрации: ${error.message || "Неизвестная ошибка"}` }
  }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete("session_user_id")
  redirect("/")
}

export async function getSession() {
  const cookieStore = await cookies()
  const userId = cookieStore.get("session_user_id")?.value

  if (!userId) return null

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) return null

    // Return only serializable data
    return {
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        role: user.role,
        preferred_language: user.preferred_language,
        created_at: user.created_at.toISOString(),
      }
    }
  } catch (error: any) {
    console.error("Get session error DETAILED:", error)
    return null
  }
}
