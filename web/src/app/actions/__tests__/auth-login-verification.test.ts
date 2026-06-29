import { getSession, login } from "../auth";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

jest.mock("@/lib/db", () => ({
  user: {
    findUnique: jest.fn(),
  },
}));

jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
}));

jest.mock("@/lib/security", () => ({
  logAuditAction: jest.fn(),
  checkRateLimit: jest.fn().mockResolvedValue(true),
  detectSuspiciousActivity: jest.fn().mockResolvedValue({ suspicious: false }),
}));

jest.mock("next/headers", () => {
  const cookieStore = {
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
  };

  return {
    headers: jest.fn().mockResolvedValue({
      get: jest.fn().mockReturnValue("127.0.0.1"),
    }),
    cookies: jest.fn().mockResolvedValue(cookieStore),
  };
});

jest.mock("@/lib/schema-fix", () => ({
  ensureSchemaFixed: jest.fn().mockResolvedValue(true),
}));

describe("auth email verification enforcement", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("blocks login for an unverified user even when the password is valid", async () => {
    const cookieStore = await cookies();
    const formData = new FormData();
    formData.append("email", "pallermo72@yandex.ru");
    formData.append("password", "password123");

    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: "user-unverified",
      email: "pallermo72@yandex.ru",
      password_hash: "hashed-password",
      email_verified_at: null,
      role: "client",
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await login(formData);

    expect(result).toEqual({ error: "emailNotVerified" });
    expect(cookieStore.set).not.toHaveBeenCalled();
  });

  it("drops an existing session for an unverified user", async () => {
    const cookieStore = await cookies();
    cookieStore.get.mockReturnValue({ value: "user-unverified" });
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: "user-unverified",
      email: "pallermo72@yandex.ru",
      full_name: "Test User",
      avatar_url: null,
      role: "client",
      created_at: new Date(),
      email_verified_at: null,
      preferred_language: "ru",
    });

    const result = await getSession();

    expect(result).toBeNull();
    expect(cookieStore.delete).toHaveBeenCalledWith("session_user_id");
    expect(cookies).toHaveBeenCalled();
  });
});
