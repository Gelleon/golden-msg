import { acceptRoomInvite, acceptRoomInviteForUser, validateRoomInvite } from "../room"
import prisma from "@/lib/db"

jest.mock("@/lib/schema-fix", () => ({
  ensureSchemaFixed: jest.fn().mockResolvedValue(undefined),
}))

const txMock = {
  roomInvite: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  roomParticipant: {
    count: jest.fn(),
    create: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
}

jest.mock("@/lib/db", () => ({
  roomInvite: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  room: {
    findUnique: jest.fn(),
  },
  roomParticipant: {
    findUnique: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  $transaction: jest.fn(async (fn: any) => fn(txMock)),
}))

jest.mock("../auth", () => ({
  getSession: jest.fn(),
}))

describe("Room invites", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("validateRoomInvite", () => {
    it("returns Room not found when invite missing and room missing", async () => {
      ;(prisma.roomInvite.findUnique as jest.Mock).mockResolvedValue(null)
      ;(prisma.room.findUnique as jest.Mock).mockResolvedValue(null)

      const result = await validateRoomInvite("room-1", "tok")
      expect(result).toEqual({ error: "Room not found" })
    })

    it("returns Invalid invite link when invite missing but room exists", async () => {
      ;(prisma.roomInvite.findUnique as jest.Mock).mockResolvedValue(null)
      ;(prisma.room.findUnique as jest.Mock).mockResolvedValue({ id: "room-1" })

      const result = await validateRoomInvite("room-1", "tok")
      expect(result).toEqual({ error: "Invalid invite link" })
    })

    it("returns Invite link has expired", async () => {
      ;(prisma.roomInvite.findUnique as jest.Mock).mockResolvedValue({
        id: "inv-1",
        token: "tok",
        room_id: "room-1",
        expires_at: new Date(Date.now() - 1000),
        uses: 0,
        max_uses: 1,
        room: { id: "room-1", capacity: 0 },
      })

      const result = await validateRoomInvite("room-1", "tok")
      expect(result).toEqual({ error: "Invite link has expired" })
    })

    it("returns Room is full when capacity exceeded", async () => {
      ;(prisma.roomInvite.findUnique as jest.Mock).mockResolvedValue({
        id: "inv-1",
        token: "tok",
        room_id: "room-1",
        expires_at: new Date(Date.now() + 100000),
        uses: 0,
        max_uses: 1,
        room: { id: "room-1", capacity: 1 },
      })
      ;(prisma.roomParticipant.count as jest.Mock).mockResolvedValue(1)

      const result = await validateRoomInvite("room-1", "tok")
      expect(result).toEqual({ error: "Room is full" })
    })
  })

  describe("acceptRoomInvite (wrapper)", () => {
    it("returns Unauthorized when no session", async () => {
      const { getSession } = jest.requireMock("../auth")
      ;(getSession as jest.Mock).mockResolvedValue(null)

      const result = await acceptRoomInvite("room-1", "tok")
      expect(result).toEqual({ error: "Unauthorized" })
    })
  })

  describe("acceptRoomInviteForUser", () => {
    it("is idempotent when already participant", async () => {
      ;(prisma.roomInvite.findUnique as jest.Mock).mockResolvedValue({
        id: "inv-1",
        token: "tok",
        room_id: "room-1",
        expires_at: new Date(Date.now() - 1000),
        uses: 99,
        max_uses: 1,
        role: "client",
        room: { id: "room-1", capacity: 1 },
      })
      ;(prisma.roomParticipant.findUnique as jest.Mock).mockResolvedValue({ id: "rp-1" })

      const result = await acceptRoomInviteForUser({ userId: "u-1", roomId: "room-1", token: "tok" })
      expect(result).toEqual({ success: true, roomId: "room-1" })
      expect(prisma.$transaction).not.toHaveBeenCalled()
    })

    it("creates participant and increments uses on success", async () => {
      ;(prisma.roomInvite.findUnique as jest.Mock).mockResolvedValue({
        id: "inv-1",
        token: "tok",
        room_id: "room-1",
        expires_at: new Date(Date.now() + 100000),
        uses: 0,
        max_uses: 1,
        role: "client",
        room: { id: "room-1", capacity: 0 },
      })
      ;(prisma.roomParticipant.findUnique as jest.Mock).mockResolvedValue(null)

      txMock.roomInvite.findUnique.mockResolvedValue({
        id: "inv-1",
        token: "tok",
        room_id: "room-1",
        expires_at: new Date(Date.now() + 100000),
        uses: 0,
        max_uses: 1,
        role: "client",
        room: { id: "room-1", capacity: 0 },
      })
      txMock.roomParticipant.count.mockResolvedValue(0)
      txMock.user.findUnique.mockResolvedValue({ role: "client" })

      const result = await acceptRoomInviteForUser({ userId: "u-1", roomId: "room-1", token: "tok" })
      expect(result).toEqual({ success: true, roomId: "room-1" })
      expect(txMock.roomInvite.update).toHaveBeenCalled()
      expect(txMock.roomParticipant.create).toHaveBeenCalled()
    })

    it("returns Room is full when capacity exceeded", async () => {
      ;(prisma.roomInvite.findUnique as jest.Mock).mockResolvedValue({
        id: "inv-1",
        token: "tok",
        room_id: "room-1",
        expires_at: new Date(Date.now() + 100000),
        uses: 0,
        max_uses: 1,
        role: "client",
        room: { id: "room-1", capacity: 1 },
      })
      ;(prisma.roomParticipant.findUnique as jest.Mock).mockResolvedValue(null)

      txMock.roomInvite.findUnique.mockResolvedValue({
        id: "inv-1",
        token: "tok",
        room_id: "room-1",
        expires_at: new Date(Date.now() + 100000),
        uses: 0,
        max_uses: 1,
        role: "client",
        room: { id: "room-1", capacity: 1 },
      })
      txMock.roomParticipant.count.mockResolvedValue(1)

      const result = await acceptRoomInviteForUser({ userId: "u-1", roomId: "room-1", token: "tok" })
      expect(result).toEqual({ error: "Room is full" })
      expect(txMock.roomInvite.update).not.toHaveBeenCalled()
      expect(txMock.roomParticipant.create).not.toHaveBeenCalled()
    })
  })
})

