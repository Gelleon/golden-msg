import { register, verifyEmailToken } from "../auth";
import prisma from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { cookies } from "next/headers";

jest.mock("@/lib/db", () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
  },
  emailVerificationToken: {
    create: jest.fn(),
    findUnique: jest.fn(),
    deleteMany: jest.fn(),
  },
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn().mockResolvedValue("hashed_password"),
}));

jest.mock("@/lib/email", () => ({
  sendEmail: jest.fn(),
}));

jest.mock("@/lib/security", () => ({
  logAuditAction: jest.fn(),
  checkRateLimit: jest.fn().mockResolvedValue(true),
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

describe("auth.register email verification", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.EMAIL_VERIFICATION_BYPASS;
    (prisma.emailVerificationToken.create as jest.Mock).mockResolvedValue({ id: "token-1" });
    (sendEmail as jest.Mock).mockResolvedValue({ success: true, messageId: "message-1" });
  });

  it("creates verification token and sends email on successful registration", async () => {
    const formData = new FormData();
    formData.append("email", "new@example.com");
    formData.append("password", "password123");
    formData.append("fullName", "Test User");
    formData.append("language", "ru");

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.user.count as jest.Mock).mockResolvedValue(5);
    (prisma.user.create as jest.Mock).mockResolvedValue({
      id: "user-new",
      email: "new@example.com",
      role: "client",
    });

    const result = await register(formData);

    expect(result).toEqual({
      success: true,
      requiresVerification: true,
      email: "new@example.com",
    });
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        email: "new@example.com",
        email_verified_at: null,
      }),
    });
    expect(prisma.emailVerificationToken.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        user_id: "user-new",
        token: expect.any(String),
        expires_at: expect.any(Date),
      }),
    });
    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "new@example.com",
        subject: expect.any(String),
      })
    );
    const cookieStore = await cookies();
    expect(cookieStore.set).not.toHaveBeenCalled();
  });

  it("rolls back user when verification email fails to send", async () => {
    const formData = new FormData();
    formData.append("email", "fail@example.com");
    formData.append("password", "password123");
    formData.append("fullName", "Fail User");

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.user.count as jest.Mock).mockResolvedValue(5);
    (prisma.user.create as jest.Mock).mockResolvedValue({
      id: "user-fail",
      email: "fail@example.com",
      role: "client",
    });
    (sendEmail as jest.Mock).mockRejectedValue(new Error("SMTP down"));

    const result = await register(formData);

    expect(result).toEqual({ error: "errorRegistrationFailed" });
    expect(prisma.emailVerificationToken.deleteMany).toHaveBeenCalledWith({
      where: { user_id: "user-fail" },
    });
    expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: "user-fail" } });
  });

  it("rolls back user when email transport returns an error result", async () => {
    const formData = new FormData();
    formData.append("email", "smtp-error@example.com");
    formData.append("password", "password123");
    formData.append("fullName", "SMTP Error");

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.user.count as jest.Mock).mockResolvedValue(5);
    (prisma.user.create as jest.Mock).mockResolvedValue({
      id: "user-smtp-error",
      email: "smtp-error@example.com",
      role: "client",
    });
    (sendEmail as jest.Mock).mockResolvedValue({ success: false, error: "SMTP down" });

    const result = await register(formData);

    expect(result).toEqual({ error: "errorRegistrationFailed" });
    expect(prisma.emailVerificationToken.deleteMany).toHaveBeenCalledWith({
      where: { user_id: "user-smtp-error" },
    });
    expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: "user-smtp-error" } });
  });

  it("marks email verified and deletes verification tokens", async () => {
    (prisma.emailVerificationToken.findUnique as jest.Mock).mockResolvedValue({
      token: "valid-token",
      user_id: "user-verified",
      expires_at: new Date(Date.now() + 60_000),
    });

    const result = await verifyEmailToken("valid-token");

    expect(result).toEqual({ success: true });
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: "user-verified" },
      data: { email_verified_at: expect.any(Date) },
    });
    expect(prisma.emailVerificationToken.deleteMany).toHaveBeenCalledWith({
      where: { user_id: "user-verified" },
    });
  });

  it("returns verificationExpired and deletes expired token", async () => {
    (prisma.emailVerificationToken.findUnique as jest.Mock).mockResolvedValue({
      token: "expired-token",
      user_id: "user-expired",
      expires_at: new Date(Date.now() - 60_000),
    });

    const result = await verifyEmailToken("expired-token");

    expect(result).toEqual({ error: "verificationExpired" });
    expect(prisma.user.update).not.toHaveBeenCalled();
    expect(prisma.emailVerificationToken.deleteMany).toHaveBeenCalledWith({
      where: { token: "expired-token" },
    });
  });

  it("returns verificationInvalid for unknown token", async () => {
    (prisma.emailVerificationToken.findUnique as jest.Mock).mockResolvedValue(null);

    const result = await verifyEmailToken("missing-token");

    expect(result).toEqual({ error: "verificationInvalid" });
    expect(prisma.user.update).not.toHaveBeenCalled();
  });
});
