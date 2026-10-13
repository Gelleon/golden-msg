import { adminResetUserPassword } from "../users"
import prisma from "@/lib/db"
import { getSession } from "../auth"
import { sendEmail } from "@/lib/email"
import bcrypt from "bcryptjs"

jest.mock("@/lib/db", () => ({
  user: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  auditLog: {
    create: jest.fn(),
  },
}))

jest.mock("../auth", () => ({
  getSession: jest.fn(),
}))

jest.mock("@/lib/email", () => ({
  sendEmail: jest.fn(),
}))

jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
}))

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}))

jest.mock("@/lib/schema-fix", () => ({
  ensureSchemaFixed: jest.fn(),
}))

describe("users.adminResetUserPassword", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(bcrypt.hash as jest.Mock).mockResolvedValue("hashed-password")
    ;(sendEmail as jest.Mock).mockResolvedValue({ success: true })
  })

  it("denies non-admin users", async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ user: { id: "manager-1", role: "manager" } })

    const res = await adminResetUserPassword("user-1")

    expect(res).toEqual({ error: "Permission denied" })
    expect(prisma.user.update).not.toHaveBeenCalled()
    expect(sendEmail).not.toHaveBeenCalled()
  })

  it("generates a new password, stores its hash, emails the user, and writes audit log", async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ user: { id: "admin-1", role: "admin" } })
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: "user-1",
      email: "user@example.com",
      full_name: "User Name",
      role: "client",
      password_hash: "old-hash",
      preferred_language: "ru",
    })
    ;(prisma.user.update as jest.Mock).mockResolvedValue({ id: "user-1" })
    ;(prisma.auditLog.create as jest.Mock).mockResolvedValue({ id: "log-1" })

    const res = await adminResetUserPassword("user-1")
    const generatedPassword = (bcrypt.hash as jest.Mock).mock.calls[0][0]

    expect(generatedPassword).toHaveLength(14)
    expect(generatedPassword).toMatch(/[a-z]/)
    expect(generatedPassword).toMatch(/[A-Z]/)
    expect(generatedPassword).toMatch(/\d/)
    expect(generatedPassword).toMatch(/[!@#$%^&*]/)
    expect(bcrypt.hash).toHaveBeenCalledWith(generatedPassword, 12)
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: "user-1" },
      data: {
        password_hash: "hashed-password",
        last_password_reset_at: expect.any(Date),
      },
    })
    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "user@example.com",
        subject: expect.stringContaining("пароль"),
        html: expect.stringContaining(generatedPassword),
      })
    )
    expect(prisma.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          user_id: "admin-1",
          action: "admin_password_reset",
          details: expect.stringContaining("user@example.com"),
        }),
      })
    )
    expect(res).toEqual({ success: true })
  })
})
