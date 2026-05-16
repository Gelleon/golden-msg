import { updateUserName } from "../users"
import prisma from "@/lib/db"
import { getSession } from "../auth"

jest.mock("@/lib/db", () => ({
  user: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  auditLog: {
    create: jest.fn(),
  },
  $transaction: jest.fn((promises) => Promise.all(promises)),
}))

jest.mock("../auth", () => ({
  getSession: jest.fn(),
}))

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}))

jest.mock("@/lib/schema-fix", () => ({
  ensureSchemaFixed: jest.fn(),
}))

describe("users.updateUserName", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("denies when unauthorized", async () => {
    ;(getSession as jest.Mock).mockResolvedValue(null)
    const res = await updateUserName("u1", "Test")
    expect(res).toEqual({ error: "Unauthorized" })
    expect(prisma.user.update).not.toHaveBeenCalled()
  })

  it("denies when role is not admin/manager", async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ user: { id: "actor-1", role: "client" } })
    const res = await updateUserName("u1", "Test")
    expect(res).toEqual({ error: "Permission denied" })
    expect(prisma.user.update).not.toHaveBeenCalled()
  })

  it("validates empty name", async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ user: { id: "actor-1", role: "admin" } })
    const res = await updateUserName("u1", "   ")
    expect(res).toEqual({ error: "Name cannot be empty" })
  })

  it("validates invalid characters", async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ user: { id: "actor-1", role: "admin" } })
    const res = await updateUserName("u1", "Bad <Name>")
    expect(res).toEqual({ error: "Invalid characters in name" })
  })

  it("validates max length", async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ user: { id: "actor-1", role: "admin" } })
    const res = await updateUserName("u1", "a".repeat(61))
    expect(res).toEqual({ error: "Name is too long" })
  })

  it("updates name and writes audit log (admin)", async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ user: { id: "actor-1", role: "admin" } })
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: "u1",
      full_name: "Old Name",
      email: "u1@example.com",
      role: "client",
    })
    ;(prisma.user.update as jest.Mock).mockResolvedValue({ id: "u1" })
    ;(prisma.auditLog.create as jest.Mock).mockResolvedValue({ id: "log-1" })

    const res = await updateUserName("u1", "New Name")

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: "u1" },
      data: { full_name: "New Name" },
    })
    expect(prisma.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          user_id: "actor-1",
          action: "user_name_changed",
          details: expect.any(String),
        }),
      })
    )
    expect(res).toEqual({ success: true, user: { id: "u1", full_name: "New Name" } })
  })

  it("updates name and writes audit log (manager)", async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ user: { id: "actor-2", role: "manager" } })
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: "u2",
      full_name: null,
      email: "u2@example.com",
      role: "partner",
    })
    ;(prisma.user.update as jest.Mock).mockResolvedValue({ id: "u2" })
    ;(prisma.auditLog.create as jest.Mock).mockResolvedValue({ id: "log-2" })

    const res = await updateUserName("u2", "Анна")
    expect(res).toEqual({ success: true, user: { id: "u2", full_name: "Анна" } })
  })
})

