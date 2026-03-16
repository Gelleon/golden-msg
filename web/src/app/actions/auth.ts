"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import prisma from "@/lib/db"
import bcrypt from "bcryptjs"
import { z } from "zod"
import crypto from "crypto" // for tokens
import { sendEmail } from "@/lib/email"
import { logAuditAction, checkRateLimit, securityDelay } from "@/lib/security"
import { headers } from "next/headers"

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().optional(),
  language: z.enum(["ru", "cn"]).optional(),
})

export async function login(formData: FormData) {
  console.log("LOGIN ATTEMPT", formData.get("email"))
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "errorFieldsRequired" }
  }

  try {
    console.log("FINDING USER", email)
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      console.log("USER NOT FOUND", email)
      return { error: "errorUserNotFound" }
    }

    console.log("COMPARING PASSWORD")
    const isValid = await bcrypt.compare(password, user.password_hash)

    if (!isValid) {
      console.log("INVALID PASSWORD")
      return { error: "errorInvalidPassword" }
    }

    // Set session cookie
    console.log("SETTING COOKIE", user.id)
    const cookieStore = await cookies()
    cookieStore.set("session_user_id", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    console.log("LOGIN SUCCESS")
    return { success: true }
  } catch (error: any) {
    console.error("Login error DETAILED:", error)
    return { error: "errorLoginFailed" }
  }
}

export async function register(formData: FormData) {
  console.log("REGISTER ATTEMPT", formData.get("email"))
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const fullName = formData.get("fullName") as string
  const language = formData.get("language") as string

  // Manual validation because safeParse was failing on optional fields or types
  if (!email || !password || password.length < 6) {
    return { error: "errorFieldsRequired" }
  }

  try {
    console.log("FINDING EXISTING USER", email)
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      console.log("USER ALREADY EXISTS", email)
      return { error: "errorUserExists" }
    }

    console.log("HASHING PASSWORD")
    const hashedPassword = await bcrypt.hash(password, 10)

    // Check if it's the first user
    console.log("CHECKING USER COUNT")
    const userCount = await prisma.user.count()
    const role = userCount === 0 ? "admin" : "client"

    console.log("CREATING USER", email, role)
    const user = await prisma.user.create({
      data: {
        email,
        password_hash: hashedPassword,
        full_name: fullName,
        preferred_language: language || "ru",
        role: role,
      },
    })

    // Set session cookie
    console.log("SETTING COOKIE", user.id)
    const cookieStore = await cookies()
    cookieStore.set("session_user_id", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    console.log("REGISTRATION SUCCESS")
    return { success: true }
  } catch (error: any) {
    console.error("Registration error DETAILED:", error)
    return { error: "errorRegistrationFailed" }
  }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete("session_user_id")
  redirect("/")
}

export async function getSession() {
  const cookieStore = await cookies()
  const userId = cookieStore.get("session_user_id")?.value

  if (!userId) return null

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) return null

    // Return only serializable data
    return {
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        role: user.role,
        preferred_language: user.preferred_language,
        created_at: user.created_at.toISOString(),
      }
    }
  } catch (error: any) {
    console.error("Get session error DETAILED:", error)
    return null
  }
}

/**
 * PASSWORD RECOVERY SYSTEM
 */

export async function forgotPassword(formData: FormData) {
  const email = formData.get("email") as string;
  const headerList = await headers();
  const ip = headerList.get('x-forwarded-for') || 'unknown';

  if (!email || !z.string().email().safeParse(email).success) {
    return { error: "emailError" };
  }

  // 1.// Rate Limiting (max 3 per hour)
  const isAllowed = await checkRateLimit(ip, "PASSWORD_RESET_REQUESTED", 3, 60 * 60 * 1000);
  if (!isAllowed) {
    return { error: "welcome.recovery.errorRateLimit" };
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    // 2. Audit Log
    await logAuditAction({
      userId: user?.id,
      action: "PASSWORD_RESET_REQUESTED",
      ipAddress: ip,
      details: { email }
    });

    // 3. Security: Always return success to prevent email enumeration
    if (!user) {
      await securityDelay(2); // Anti-enumeration delay
      return { success: true }; 
    }

    // 4. Generate unique token (Secure random)
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // 5. Save to DB
    await prisma.passwordResetToken.create({
      data: {
        token,
        user_id: user.id,
        expires_at: expiresAt
      }
    });

    // 6. Send Email
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`;
    
    // Simple template selection based on user language
    const lang = user.preferred_language === 'cn' ? 'cn' : 'ru';
    // We would normally use t() here, but this is server-side and we need the user's pref
    const subjects = {
      ru: "Восстановление пароля - Golden Russia",
      cn: "找回密码 - Golden Russia"
    };

    await sendEmail({
      to: user.email,
      subject: subjects[lang],
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #0f172a;">Golden Russia</h2>
          <p>${lang === 'cn' ? '您好！' : 'Здравствуйте!'}</p>
          <p>${lang === 'cn' ? '您收到这封邮件是因为我们收到了重置您账户密码的请求。' : 'Вы получили это письмо, так как мы получили запрос на сброс пароля для вашего аккаунта.'}</p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${resetUrl}" style="background-color: #0f172a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              ${lang === 'cn' ? '重置密码' : 'Сбросить пароль'}
            </a>
          </div>
          <p style="font-size: 12px; color: #64748b;">
            ${lang === 'cn' ? '该链接的有效期为 24 小时。' : 'Срок действия ссылки — 24 часа.'}<br>
            ${lang === 'cn' ? '如果您没有请求重置密码，请忽略此邮件。' : 'Если вы не запрашивали сброс пароля, просто проигнорируйте это письмо.'}
          </p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 10px; color: #94a3b8; text-align: center;">GOLDEN RUSSIA &copy; 2024</p>
        </div>
      `
    });

    return { success: true };
  } catch (error) {
    console.error("Forgot password error:", error);
    return { error: "errorUnknown" };
  }
}

export async function resetPassword(formData: FormData) {
  const token = formData.get("token") as string;
  const password = formData.get("password") as string;
  const headerList = await headers();
  const ip = headerList.get('x-forwarded-for') || 'unknown';

  if (!token || !password || password.length < 8) {
    return { error: "errorFieldsRequired" };
  }

  // Password complexity check (OWASP)
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    return { error: "recovery.passwordComplexity" };
  }

  try {
    // 1. Find and validate token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!resetToken || resetToken.expires_at < new Date()) {
      return { error: "welcome.recovery.errorTokenInvalid" };
    }

    const user = resetToken.user;

    // 2. Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 3. Update user and invalidate all tokens for this user
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { 
          password_hash: hashedPassword,
          last_password_reset_at: new Date()
        }
      }),
      prisma.passwordResetToken.deleteMany({
        where: { user_id: user.id }
      })
    ]);

    // 4. Audit Log
    await logAuditAction({
      userId: user.id,
      action: "PASSWORD_RESET_SUCCESSFUL",
      ipAddress: ip
    });

    // 5. Notify user of change
    const lang = user.preferred_language === 'cn' ? 'cn' : 'ru';
    await sendEmail({
      to: user.email,
      subject: lang === 'cn' ? '您的密码已更改' : 'Ваш пароль был изменен',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #0f172a;">Golden Russia</h2>
          <p>${lang === 'cn' ? '您的 Golden Russia 账户密码已成功更改。' : 'Пароль для вашего аккаунта Golden Russia был успешно изменен.'}</p>
          <p>${lang === 'cn' ? '如果这不是您本人的操作，请立即联系支持团队。' : 'Если это были не вы, немедленно свяжитесь с поддержкой.'}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 10px; color: #94a3b8; text-align: center;">GOLDEN RUSSIA &copy; 2024</p>
        </div>
      `
    });

    // 6. Invalidate active sessions (by logic, as we use a simple session cookie, 
    // we would need a more robust session management or a session version/salt in user table to invalidate all)
    // For now, the user will have to re-login on next check if we implemented session versioning.
    
    return { success: true };
  } catch (error) {
    console.error("Reset password error:", error);
    return { error: "errorUnknown" };
  }
}
