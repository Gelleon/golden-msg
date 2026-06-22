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
  emailVerificationToken: {
    create: jest.fn(),
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
  });

  it("creates verification token and sends email on successful registration", async () => {
    const formData = new FormData();
    formData.append("email", "new@example.com");
    formData.append("password", "password123");
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
});
