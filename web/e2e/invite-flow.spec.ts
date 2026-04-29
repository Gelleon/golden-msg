import { test, expect } from "@playwright/test"
import path from "path"

test("unauth invite redirects to register and register joins room", async ({ page }) => {
  test.setTimeout(90000)
  const dbFile = path.join(process.cwd(), "prisma", "e2e.sqlite").replace(/\\/g, "/")
  const databaseUrl = process.env.DATABASE_URL || `file:${dbFile}`
  process.env.DATABASE_URL = databaseUrl
  const { PrismaClient } = await import("../src/generated/prisma-client/index.js")
  const prisma = new PrismaClient()

  const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`
  const email = `user-${suffix}@example.com`
  const creator = await prisma.user.create({
    data: {
      email: `creator-${suffix}@example.com`,
      full_name: "Creator",
    },
    select: { id: true },
  })

  const room = await prisma.room.create({
    data: {
      name: `Room ${suffix}`,
      type: "group",
    },
    select: { id: true },
  })

  const token = `tok-${suffix}`.replace(/[^a-zA-Z0-9]/g, "")
  await prisma.roomInvite.create({
    data: {
      token,
      room_id: room.id,
      created_by: creator.id,
      role: "client",
      expires_at: new Date(Date.now() + 60 * 60 * 1000),
      max_uses: 10,
      uses: 0,
    },
  })

  try {
    await page.goto(`/invite/${room.id}/${token}`, { waitUntil: "domcontentloaded" })
    await page.waitForURL((url) => {
      return (
        url.pathname === "/" &&
        url.searchParams.get("mode") === "register" &&
        url.searchParams.get("inviteRoomId") === room.id &&
        url.searchParams.get("inviteToken") === token
      )
    })

    await page.locator("button", { hasText: "🇷🇺" }).click()

    await page.fill("#email", email)
    await page.fill("#password", "StrongPass123!")
    await page.fill("#confirmPassword", "StrongPass123!")
    await page.fill("#fullName", "Test User")
    await page.locator('button[type="submit"]').click()

    await expect(page).toHaveURL(new RegExp(`/dashboard/rooms/${room.id}$`))
  } finally {
    await prisma.room.delete({ where: { id: room.id } }).catch(() => {})
    await prisma.user.delete({ where: { id: creator.id } }).catch(() => {})
    await prisma.user.deleteMany({ where: { email } }).catch(() => {})
    await prisma.$disconnect()
  }
})
