"use server"

import prisma from "@/lib/db"
import { ensureSchemaFixed } from "@/lib/schema-fix"
import { getSession } from "./auth"

export async function pingUserPresence() {
  const session = await getSession()
  if (!session?.user) return { error: "Unauthorized" }

  try {
    await ensureSchemaFixed()
    await prisma.user.update({
      where: { id: session.user.id },
      data: { last_active_at: new Date() },
    })
    return { success: true }
  } catch (error) {
    console.error("Error pinging user presence:", error)
    return { error: "Failed to ping user presence" }
  }
}
