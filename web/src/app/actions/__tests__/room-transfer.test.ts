import { transferUser } from "../room"
import prisma from "@/lib/db"
import { getSession } from "../auth"

jest.mock("@/lib/db", () => ({
  user: {
    findUnique: jest.fn(),
  },
  roomParticipant: {
    delete: jest.fn(),
    create: jest.fn(),
  },
  $transaction: jest.fn((cmds) => Promise.all(cmds)),
}))

jest.mock("../auth", () => ({
  getSession: jest.fn(),
}))

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}))

describe("room.transferUser", () => {
  const adminId = "admin-1"
  const managerId = "manager-1"
  const clientId = "client-1"
  const targetUserId = "user-to-move"

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("admin should be able to transfer user", async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ user: { id: adminId, role: "admin" } })
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({ role: "admin" })

    const result = await transferUser(targetUserId, "from-room", "to-room")

    expect(result).toEqual({ success: true })
    expect(prisma.$transaction).toHaveBeenCalled()
  })

  it("manager should be able to transfer user", async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ user: { id: managerId, role: "manager" } })
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({ role: "manager" })

    const result = await transferUser(targetUserId, "from-room", "to-room")

    expect(result).toEqual({ success: true })
  })

  it("client should NOT be able to transfer user", async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ user: { id: clientId, role: "client" } })
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({ role: "client" })

    const result = await transferUser(targetUserId, "from-room", "to-room")

    expect(result).toEqual({ error: "Permission denied" })
    expect(prisma.$transaction).not.toHaveBeenCalled()
  })
})
