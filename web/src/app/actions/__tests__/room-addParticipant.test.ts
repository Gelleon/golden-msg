import { addParticipant } from "../room"
import prisma from "@/lib/db"
import { getSession } from "../auth"

jest.mock("@/lib/db", () => ({
  user: {
    findUnique: jest.fn(),
  },
  room: {
    findUnique: jest.fn(),
  },
  roomParticipant: {
    create: jest.fn(),
  },
}))

jest.mock("../auth", () => ({
  getSession: jest.fn(),
}))

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}))

jest.mock("@/lib/sse", () => ({
  sendSSEUpdate: jest.fn(),
}))

describe("room.addParticipant", () => {
  const currentUserId = "u-current"
  const targetUserId = "u-target"

  const setMocks = (opts: {
    currentRole: string
    targetRole: string
    roomType: string
    createdBy: string | null
  }) => {
    ;(getSession as jest.Mock).mockResolvedValue({ user: { id: currentUserId } })
    ;(prisma.user.findUnique as jest.Mock).mockImplementation(async ({ where }: any) => {
      if (where?.id === currentUserId) return { role: opts.currentRole }
      if (where?.id === targetUserId) return { role: opts.targetRole }
      return null
    })
    ;(prisma.room.findUnique as jest.Mock).mockResolvedValue(
      opts.createdBy === null
        ? { created_by: null, type: opts.roomType }
        : { created_by: opts.createdBy, type: opts.roomType }
    )
    ;(prisma.roomParticipant.create as jest.Mock).mockResolvedValue({
      user: {
        id: targetUserId,
        full_name: null,
        avatar_url: null,
        role: opts.targetRole,
      },
      joined_at: new Date("2020-01-01T00:00:00.000Z"),
    })
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("private: admin can add partner", async () => {
    setMocks({ currentRole: "admin", targetRole: "partner", roomType: "private", createdBy: "someone" })
    const result = await addParticipant("room-1", targetUserId)
    expect(result).toEqual({ success: true })
    expect(prisma.roomParticipant.create).toHaveBeenCalled()
  })

  it("private: admin cannot add client", async () => {
    setMocks({ currentRole: "admin", targetRole: "client", roomType: "private", createdBy: "someone" })
    const result = await addParticipant("room-1", targetUserId)
    expect(result).toEqual({ error: "Cannot add client to private chat" })
    expect(prisma.roomParticipant.create).not.toHaveBeenCalled()
  })

  it("private: manager can add admin", async () => {
    setMocks({ currentRole: "manager", targetRole: "admin", roomType: "private", createdBy: "someone" })
    const result = await addParticipant("room-1", targetUserId)
    expect(result).toEqual({ success: true })
    expect(prisma.roomParticipant.create).toHaveBeenCalled()
  })

  it("private: partner cannot add anyone", async () => {
    setMocks({ currentRole: "partner", targetRole: "partner", roomType: "private", createdBy: "someone" })
    const result = await addParticipant("room-1", targetUserId)
    expect(result).toEqual({ error: "Permission denied" })
    expect(prisma.roomParticipant.create).not.toHaveBeenCalled()
  })

  it("private: client cannot add anyone", async () => {
    setMocks({ currentRole: "client", targetRole: "partner", roomType: "private", createdBy: "someone" })
    const result = await addParticipant("room-1", targetUserId)
    expect(result).toEqual({ error: "Permission denied" })
    expect(prisma.roomParticipant.create).not.toHaveBeenCalled()
  })

  it("group: manager (not creator) cannot add admin", async () => {
    setMocks({ currentRole: "manager", targetRole: "admin", roomType: "group", createdBy: "other-creator" })
    const result = await addParticipant("room-1", targetUserId)
    expect(result).toEqual({ error: "Managers can only invite Clients and Partners" })
    expect(prisma.roomParticipant.create).not.toHaveBeenCalled()
  })

  it("group: manager (not creator) can add partner", async () => {
    setMocks({ currentRole: "manager", targetRole: "partner", roomType: "group", createdBy: "other-creator" })
    const result = await addParticipant("room-1", targetUserId)
    expect(result).toEqual({ success: true })
    expect(prisma.roomParticipant.create).toHaveBeenCalled()
  })
})

