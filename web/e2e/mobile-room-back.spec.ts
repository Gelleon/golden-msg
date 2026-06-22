import { test, expect, type Page } from "@playwright/test"
import path from "path"
import bcrypt from "bcryptjs"

const MOBILE_VIEWPORTS = [
  { label: "iPhone SE (4.7\")", width: 375, height: 667 },
  { label: "Galaxy S5", width: 360, height: 640 },
  { label: "Pixel 5", width: 393, height: 851 },
  { label: "iPhone 12", width: 390, height: 844 },
  { label: "iPhone 14 Pro Max (6.7\")", width: 430, height: 932 },
] as const

async function seedRoomAndLogin(page: Page) {
  const dbFile = path.join(process.cwd(), "prisma", "e2e.sqlite").replace(/\\/g, "/")
  const databaseUrl = process.env.DATABASE_URL || `file:${dbFile}`
  process.env.DATABASE_URL = databaseUrl
  const { PrismaClient } = await import("../src/generated/prisma-client/index.js")
  const prisma = new PrismaClient()

  const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`
  const email = `mobile-back-${suffix}@example.com`
  const password = "StrongPass123!"
  const passwordHash = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      email,
      full_name: "Mobile Back Admin",
      role: "admin",
      password_hash: passwordHash,
    },
    select: { id: true },
  })

  const room = await prisma.room.create({
    data: {
      name: `Mobile Back Room ${suffix}`,
      type: "group",
      created_by: user.id,
      participants: {
        create: {
          user_id: user.id,
          role: "member",
        },
      },
    },
    select: { id: true },
  })

  await page.goto("/?mode=login", { waitUntil: "domcontentloaded" })

  const russianLanguage = page.locator("button", { hasText: "🇷🇺" })
  if (await russianLanguage.isVisible({ timeout: 5000 }).catch(() => false)) {
    await russianLanguage.click()
  }

  await page.locator("#email").waitFor({ state: "visible", timeout: 15000 })
  await page.locator("#email").fill(email)
  await page.locator("#password").fill(password)
  await page.getByRole("button", { name: /Войти в систему/i }).click()
  await expect(page).toHaveURL(/\/dashboard$/)

  return {
    prisma,
    roomId: room.id,
    cleanup: async () => {
      await prisma.room.delete({ where: { id: room.id } }).catch(() => {})
      await prisma.user.delete({ where: { id: user.id } }).catch(() => {})
      await prisma.$disconnect()
    },
  }
}

test.describe("Mobile room back button", () => {
  test.describe.configure({ mode: "serial" })
  for (const viewport of MOBILE_VIEWPORTS) {
    test(`reliable touch target on ${viewport.label}`, async ({ page }) => {
      test.setTimeout(90000)
      await page.setViewportSize({ width: viewport.width, height: viewport.height })

      const { roomId, cleanup } = await seedRoomAndLogin(page)

      try {
        await page.goto(`/dashboard/rooms/${roomId}`, { waitUntil: "domcontentloaded" })
        const backButton = page.getByTestId("mobile-room-back")
        await expect(backButton).toBeVisible()

        const box = await backButton.boundingBox()
        expect(box).not.toBeNull()
        expect(box!.width).toBeGreaterThanOrEqual(44)
        expect(box!.height).toBeGreaterThanOrEqual(44)

        const hitTarget = await backButton.evaluate((el) => {
          const rect = el.getBoundingClientRect()
          const centerX = rect.left + rect.width / 2
          const centerY = rect.top + rect.height / 2
          const topElement = document.elementFromPoint(centerX, centerY)
          return topElement === el || (topElement instanceof Element && el.contains(topElement))
        })
        expect(hitTarget).toBe(true)

        await backButton.click()
        await expect(page).toHaveURL(/\/dashboard$/)
      } finally {
        await cleanup()
      }
    })
  }

  test("touch tap navigates back on mobile viewport", async ({ page }) => {
    test.setTimeout(90000)
    await page.setViewportSize({ width: 390, height: 844 })

    const { roomId, cleanup } = await seedRoomAndLogin(page)

    try {
      await page.goto(`/dashboard/rooms/${roomId}`, { waitUntil: "domcontentloaded" })
      const backButton = page.getByTestId("mobile-room-back")
      await expect(backButton).toBeVisible()

      await backButton.tap()
      await expect(page).toHaveURL(/\/dashboard$/, { timeout: 10000 })
    } finally {
      await cleanup()
    }
  })

  test("rapid taps only trigger one navigation", async ({ page }) => {
    test.setTimeout(90000)
    await page.setViewportSize({ width: 375, height: 667 })

    const { roomId, cleanup } = await seedRoomAndLogin(page)

    try {
      await page.goto(`/dashboard/rooms/${roomId}`, { waitUntil: "domcontentloaded" })
      const backButton = page.getByTestId("mobile-room-back")
      await expect(backButton).toBeVisible()

      await backButton.click({ clickCount: 3, delay: 20 })
      await expect(page).toHaveURL(/\/dashboard$/, { timeout: 10000 })
      await expect(backButton).toBeHidden()
    } finally {
      await cleanup()
    }
  })

  test("header info does not overlap back button hit area", async ({ page }) => {
    test.setTimeout(90000)
    await page.setViewportSize({ width: 360, height: 640 })

    const { roomId, cleanup } = await seedRoomAndLogin(page)

    try {
      await page.goto(`/dashboard/rooms/${roomId}`, { waitUntil: "domcontentloaded" })
      const backButton = page.getByTestId("mobile-room-back")
      const headerInfo = page.getByTestId("room-header-info")
      await expect(backButton).toBeVisible()
      await expect(headerInfo).toBeVisible()

      const overlap = await page.evaluate(() => {
        const back = document.querySelector('[data-testid="mobile-room-back"]')
        const info = document.querySelector('[data-testid="room-header-info"]')
        if (!(back instanceof HTMLElement) || !(info instanceof HTMLElement)) return true

        const backRect = back.getBoundingClientRect()
        const infoRect = info.getBoundingClientRect()
        const horizontalOverlap = backRect.right > infoRect.left && backRect.left < infoRect.right
        const verticalOverlap = backRect.bottom > infoRect.top && backRect.top < infoRect.bottom
        return horizontalOverlap && verticalOverlap
      })

      expect(overlap).toBe(false)
    } finally {
      await cleanup()
    }
  })
})
