import { forgotPassword, resetPassword, validateResetToken } from "../auth";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/email";
import crypto from "crypto";

// Mock dependencies
jest.mock("@/lib/db", () => ({
  user: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  passwordResetToken: {
    create: jest.fn(),
    findUnique: jest.fn(),
    deleteMany: jest.fn(),
  },
  $transaction: jest.fn((promises) => Promise.all(promises)),
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
}));

jest.mock("@/lib/email", () => ({
  sendEmail: jest.fn(),
}));

jest.mock("@/lib/security", () => ({
  logAuditAction: jest.fn(),
  checkRateLimit: jest.fn().mockResolvedValue(true),
  securityDelay: jest.fn(),
}));

jest.mock("next/headers", () => ({
  headers: jest.fn().mockResolvedValue({
    get: jest.fn().mockReturnValue("127.0.0.1"),
  }),
  cookies: jest.fn().mockResolvedValue({
    delete: jest.fn(),
  }),
}));

describe("Auth Actions - Password Recovery", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("forgotPassword", () => {
    it("should return error if email is invalid", async () => {
      const formData = new FormData();
      formData.append("email", "invalid-email");
      
      const result = await forgotPassword(formData);
      expect(result).toEqual({ error: "emailError" });
    });

    it("should succeed without sending email if user not found (security)", async () => {
      const formData = new FormData();
      formData.append("email", "notfound@example.com");
      
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      
      const result = await forgotPassword(formData);
      expect(result).toEqual({ success: true });
      expect(prisma.passwordResetToken.create).not.toHaveBeenCalled();
      expect(sendEmail).not.toHaveBeenCalled();
    });

    it("should generate token and send email if user is found", async () => {
      const formData = new FormData();
      formData.append("email", "user@example.com");
      
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: "user-123",
        email: "user@example.com",
        preferred_language: "ru",
      });
      
      const result = await forgotPassword(formData);
      
      expect(result).toEqual({ success: true });
      expect(prisma.passwordResetToken.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            user_id: "user-123",
            token: expect.any(String),
          })
        })
      );
      expect(sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: "user@example.com",
          subject: expect.any(String),
        })
      );
    });
  });

  describe("validateResetToken", () => {
    it("should return error if token is invalid", async () => {
      (prisma.passwordResetToken.findUnique as jest.Mock).mockResolvedValue(null);
      
      const result = await validateResetToken("invalid-token");
      expect(result).toEqual({ error: "welcome.recovery.errorTokenInvalid" });
    });

    it("should return error if token is expired", async () => {
      (prisma.passwordResetToken.findUnique as jest.Mock).mockResolvedValue({
        expires_at: new Date(Date.now() - 10000), // past
      });
      
      const result = await validateResetToken("expired-token");
      expect(result).toEqual({ error: "welcome.recovery.errorTokenExpired" });
    });

    it("should return success if token is valid and not expired", async () => {
      (prisma.passwordResetToken.findUnique as jest.Mock).mockResolvedValue({
        expires_at: new Date(Date.now() + 10000), // future
      });
      
      const result = await validateResetToken("valid-token");
      expect(result).toEqual({ success: true });
    });
  });

  describe("resetPassword", () => {
    it("should return error if fields are missing or invalid", async () => {
      const formData = new FormData();
      const result = await resetPassword(formData);
      expect(result).toEqual({ error: "errorFieldsRequired" });
    });

    it("should return error if password complexity is not met", async () => {
      const formData = new FormData();
      formData.append("token", "valid-token");
      formData.append("password", "weakpass"); // No uppercase, number, symbol
      
      const result = await resetPassword(formData);
      expect(result).toEqual({ error: "recovery.passwordComplexity" });
    });

    it("should return error if token is invalid or expired", async () => {
      const formData = new FormData();
      formData.append("token", "invalid-token");
      formData.append("password", "StrongPass123!");
      
      (prisma.passwordResetToken.findUnique as jest.Mock).mockResolvedValue(null);
      
      const result = await resetPassword(formData);
      expect(result).toEqual({ error: "welcome.recovery.errorTokenInvalid" });
    });

    it("should reset password and delete tokens on success", async () => {
      const formData = new FormData();
      formData.append("token", "valid-token");
      formData.append("password", "StrongPass123!");
      
      const mockUser = { id: "user-123", email: "user@example.com" };
      (prisma.passwordResetToken.findUnique as jest.Mock).mockResolvedValue({
        expires_at: new Date(Date.now() + 10000),
        user: mockUser,
      });
      
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashed-password");
      
      const result = await resetPassword(formData);
      
      expect(result).toEqual({ success: true });
      expect(bcrypt.hash).toHaveBeenCalledWith("StrongPass123!", 12);
      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: mockUser.id },
          data: expect.objectContaining({ password_hash: "hashed-password" })
        })
      );
      expect(prisma.passwordResetToken.deleteMany).toHaveBeenCalledWith({
        where: { user_id: mockUser.id }
      });
      expect(sendEmail).toHaveBeenCalled();
    });
  });
});
