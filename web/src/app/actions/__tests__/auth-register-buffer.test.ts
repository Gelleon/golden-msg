import { register } from "../auth";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

jest.mock("@/lib/db", () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    count: jest.fn(),
  },
  room: {
    findFirst: jest.fn(),
    create: jest.fn(),
  },
  roomParticipant: {
    create: jest.fn(),
  },
  $transaction: jest.fn((promises) => Promise.all(promises)),
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn().mockResolvedValue("hashed_password"),
}));

jest.mock("@/lib/security", () => ({
  logAuditAction: jest.fn(),
  checkRateLimit: jest.fn().mockResolvedValue(true),
  detectSuspiciousActivity: jest.fn().mockResolvedValue({ suspicious: false }),
}));

jest.mock("next/headers", () => ({
  headers: jest.fn().mockResolvedValue({
    get: jest.fn().mockReturnValue("127.0.0.1"),
  }),
  cookies: jest.fn().mockResolvedValue({
    set: jest.fn(),
  }),
}));

jest.mock("@/lib/schema-fix", () => ({
  ensureSchemaFixed: jest.fn().mockResolvedValue(true),
}));

jest.mock("@/lib/sse", () => ({
  sendSSEUpdate: jest.fn(),
}));

describe("auth.register with buffer room", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should add a new client to the buffer room", async () => {
    const formData = new FormData();
    formData.append("email", "newuser@example.com");
    formData.append("password", "password123");
    formData.append("fullName", "New User");

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.user.count as jest.Mock).mockResolvedValue(1); // Not the first user
    (prisma.user.create as jest.Mock).mockResolvedValue({ id: "user-123", role: "client" });
    (prisma.room.findFirst as jest.Mock).mockResolvedValue({ id: "buffer-room-id", is_buffer: true });

    const result = await register(formData);

    expect(result).toEqual({ success: true });
    expect(prisma.roomParticipant.create).toHaveBeenCalledWith({
      data: {
        room_id: "buffer-room-id",
        user_id: "user-123",
        role: "member"
      }
    });
  });

  it("should NOT add a new admin to the buffer room", async () => {
    const formData = new FormData();
    formData.append("email", "admin@example.com");
    formData.append("password", "password123");
    formData.append("fullName", "Admin User");

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.user.count as jest.Mock).mockResolvedValue(0); // First user -> Admin
    (prisma.user.create as jest.Mock).mockResolvedValue({ id: "admin-123", role: "admin" });

    const result = await register(formData);

    expect(result).toEqual({ success: true });
    expect(prisma.roomParticipant.create).not.toHaveBeenCalled();
  });
});
