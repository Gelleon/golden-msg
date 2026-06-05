import { getRooms } from "../room"
import prisma from "@/lib/db"
import { getSession } from "../auth"

jest.mock("@/lib/db", () => ({
  room: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
  },
  message: {
    count: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
  }
}))

jest.mock("../auth", () => ({
  getSession: jest.fn(),
}))

jest.mock("@/lib/schema-fix", () => ({
  ensureSchemaFixed: jest.fn().mockResolvedValue(true),
}))

describe("room.getRooms visibility", () => {
  const adminId = "admin-1"
  const clientId = "client-1"

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("admin should see all rooms including buffer rooms", async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ user: { id: adminId, role: "admin" } })
    ;(prisma.room.findMany as jest.Mock).mockResolvedValue([
      { id: "room-1", name: "General", type: "group", is_buffer: false, created_at: new Date(), participants: [] },
      { id: "buffer-1", name: "Комната ожидания", type: "group", is_buffer: true, created_at: new Date(), participants: [] }
    ])
    ;(prisma.message.count as jest.Mock).mockResolvedValue(0)
    ;(prisma.room.findFirst as jest.Mock).mockResolvedValue({ id: "buffer-1", is_buffer: true })

    const result = await getRooms()

    expect(result).toHaveLength(2)
    expect(result.some(r => r.is_buffer)).toBe(true)
    // Check that is_buffer filter was NOT applied for admin
    const whereClause = (prisma.room.findMany as jest.Mock).mock.calls[0][0].where
    expect(whereClause.is_buffer).toBeUndefined()
  })

  it("client should NOT see buffer rooms", async () => {
    ;(getSession as jest.Mock).mockResolvedValue({ user: { id: clientId, role: "client" } })
    ;(prisma.room.findMany as jest.Mock).mockResolvedValue([
      { id: "room-1", name: "General", type: "group", is_buffer: false, created_at: new Date(), participants: [] }
    ])
    ;(prisma.message.count as jest.Mock).mockResolvedValue(0)

    const result = await getRooms()

    expect(result).toHaveLength(1)
    expect(result.some(r => r.is_buffer)).toBe(false)
    // Check that is_buffer: false filter WAS applied for client
    const whereClause = (prisma.room.findMany as jest.Mock).mock.calls[0][0].where
    expect(whereClause.is_buffer).toBe(false)
  })
})
