import { register } from "../auth";
import prisma from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { cookies } from "next/headers";

jest.mock("@/lib/db", () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  room: {
    findFirst: jest.fn(),
    create: jest.fn(),
  },
  roomParticipant: {
    create: jest.fn(),
  },
  message: {
    create: jest.fn(),
  },
  emailVerificationToken: {
    create: jest.fn(),
    deleteMany: jest.fn(),
  },
  $transaction: jest.fn((promises) => Promise.all(promises)),
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn().mockResolvedValue("hashed_password"),
}));

jest.mock("@/lib/email", () => ({
  sendEmail: jest.fn().mockResolvedValue(undefined),
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
    delete process.env.EMAIL_VERIFICATION_BYPASS;
    (prisma.message.create as jest.Mock).mockResolvedValue({
      id: "msg-1",
      room_id: "buffer-room-id",
      content: "system",
      sender: { id: "user-123", full_name: "New User", avatar_url: null, role: "client" },
    });
    (prisma.emailVerificationToken.create as jest.Mock).mockResolvedValue({ id: "token-1" });
  });

  it("returns emailError for invalid email", async () => {
    const formData = new FormData();
    formData.append("email", "invalid-email");
    formData.append("password", "password123");

    const result = await register(formData);

    expect(result).toEqual({ error: "emailError" });
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it("returns errorUserExists for duplicate normalized email", async () => {
    const formData = new FormData();
    formData.append("email", "Existing@Example.com");
    formData.append("password", "password123");

    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: "existing-user" });

    const result = await register(formData);

    expect(result).toEqual({ error: "errorUserExists" });
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: "existing@example.com" },
      select: { id: true },
    });
  });

  it("should add a new client to the buffer room", async () => {
    const formData = new FormData();
    formData.append("email", "newuser@example.com");
    formData.append("password", "password123");
    formData.append("fullName", "New User");

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.user.count as jest.Mock).mockResolvedValue(1);
    (prisma.user.create as jest.Mock).mockResolvedValue({ id: "user-123", role: "client", email: "newuser@example.com" });
    (prisma.room.findFirst as jest.Mock).mockResolvedValue({ id: "buffer-room-id", is_buffer: true });

    const result = await register(formData);

    expect(result).toEqual({
      success: true,
      requiresVerification: true,
      email: "newuser@example.com",
    });
    const cookieStore = await cookies();
    expect(cookieStore.set).not.toHaveBeenCalled();
    expect(prisma.emailVerificationToken.create).toHaveBeenCalled();
    expect(sendEmail).toHaveBeenCalled();
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
    (prisma.user.count as jest.Mock).mockResolvedValue(0);
    (prisma.user.create as jest.Mock).mockResolvedValue({ id: "admin-123", role: "admin", email: "admin@example.com" });

    const result = await register(formData);

    expect(result).toEqual({
      success: true,
      requiresVerification: true,
      email: "admin@example.com",
    });
    expect(prisma.roomParticipant.create).not.toHaveBeenCalled();
    const cookieStore = await cookies();
    expect(cookieStore.set).not.toHaveBeenCalled();
  });

  it("sets session cookie when EMAIL_VERIFICATION_BYPASS is enabled", async () => {
    process.env.EMAIL_VERIFICATION_BYPASS = "true";

    const formData = new FormData();
    formData.append("email", "bypass@example.com");
    formData.append("password", "password123");

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.user.count as jest.Mock).mockResolvedValue(1);
    (prisma.user.create as jest.Mock).mockResolvedValue({ id: "user-bypass", role: "client", email: "bypass@example.com" });
    (prisma.room.findFirst as jest.Mock).mockResolvedValue({ id: "buffer-room-id", is_buffer: true });

    const result = await register(formData);

    expect(result).toEqual({ success: true });
    const cookieStore = await cookies();
    expect(cookieStore.set).toHaveBeenCalled();
    expect(sendEmail).not.toHaveBeenCalled();
  });
});
