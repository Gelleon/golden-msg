"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import prisma from "@/lib/db"
import bcrypt from "bcryptjs"
import { z } from "zod"
import crypto from "crypto" // for tokens
import { sendEmail } from "@/lib/email"
import { logAuditAction, checkRateLimit, securityDelay, detectSuspiciousActivity } from "@/lib/security"
import { headers } from "next/headers"
import { ensureSchemaFixed } from "@/lib/schema-fix"

import ru from '@/locales/ru.json'
import cn from '@/locales/cn.json'

const translations: any = { ru, cn }

function t(path: string, lang: string = 'ru'): string {
  const keys = path.split('.')
  let result: any = translations[lang] || translations['ru']
  
  for (const key of keys) {
    if (result && result[key]) {
      result = result[key]
    } else {
      return path
    }
  }
  
  return typeof result === 'string' ? result : path
}

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().optional(),
  language: z.enum(["ru", "cn"]).optional(),
})

export async function login(formData: FormData) {
  await ensureSchemaFixed()
  console.log("LOGIN ATTEMPT", formData.get("email"))
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "errorFieldsRequired" }
  }

  const headerList = await headers();
  const ip = headerList.get('x-forwarded-for') || 'unknown';

  // Check rate limit for login (max 5 per 15 minutes)
  const isAllowed = await checkRateLimit(ip, "LOGIN_ATTEMPT", 5, 15 * 60 * 1000);
  if (!isAllowed) {
    return { error: "welcome.recovery.errorRateLimit" };
  }

  try {
    console.log("FINDING USER", email)
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password_hash: true,
        // @ts-ignore
        // preferred_language: true, 
        role: true,
      }
    })

    if (!user) {
      console.log("USER NOT FOUND", email)
      await logAuditAction({
        action: "LOGIN_FAILED",
        ipAddress: ip,
        details: { email, reason: "user_not_found" }
      });
      return { error: "errorUserNotFound" }
    }

    console.log("COMPARING PASSWORD")
    const isValid = await bcrypt.compare(password, user.password_hash)

    if (!isValid) {
      console.log("INVALID PASSWORD")
      await logAuditAction({
        userId: user.id,
        action: "LOGIN_FAILED",
        ipAddress: ip,
        details: { email, reason: "invalid_password" }
      });
      return { error: "errorInvalidPassword" }
    }

    // Check for suspicious activity before final login
    const suspicious = await detectSuspiciousActivity(ip);
    if (suspicious.suspicious) {
        console.warn(`Suspicious activity detected for IP ${ip}: ${suspicious.reason}`);
        // Log this specifically
        await logAuditAction({
            userId: user.id,
            action: "SUSPICIOUS_LOGIN_BLOCKED",
            ipAddress: ip,
            details: { reason: suspicious.reason, details: suspicious.details }
        });
        // We could block it here if we wanted, but for now we just log it and proceed
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

    await logAuditAction({
      userId: user.id,
      action: "LOGIN_SUCCESS",
      ipAddress: ip
    });

    console.log("LOGIN SUCCESS")
    return { success: true }
  } catch (error: any) {
    console.error("Login error DETAILED:", error)
    return { error: "errorLoginFailed" }
  }
}

export async function register(formData: FormData) {
  await ensureSchemaFixed()
  console.log("REGISTER ATTEMPT", formData.get("email"))
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const fullName = formData.get("fullName") as string
  const language = formData.get("language") as string

  // Manual validation because safeParse was failing on optional fields or types
  if (!email || !password || password.length < 6) {
    return { error: "errorFieldsRequired" }
  }

  const headerList = await headers();
  const ip = headerList.get('x-forwarded-for') || 'unknown';

  // Check rate limit for registration (max 3 per hour)
  const isAllowed = await checkRateLimit(ip, "REGISTRATION_ATTEMPT", 3, 60 * 60 * 1000);
  if (!isAllowed) {
    return { error: "welcome.recovery.errorRateLimit" };
  }

  try {
    console.log("FINDING EXISTING USER", email)
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    })

    if (existingUser) {
      console.log("USER ALREADY EXISTS", email)
      await logAuditAction({
        action: "REGISTRATION_FAILED",
        ipAddress: ip,
        details: { email, reason: "user_exists" }
      });
      return { error: "errorUserExists" }
    }

    console.log("HASHING PASSWORD")
    const hashedPassword = await bcrypt.hash(password, 10)

    // Check if it's the first user
    console.log("CHECKING USER COUNT")
    const userCount = await prisma.user.count()
    const role = userCount === 0 ? "admin" : "client"

    console.log("CREATING USER", email, role)
    const userData: any = {
      email,
      password_hash: hashedPassword,
      full_name: fullName,
      role: role,
    };

    // Try to add preferred_language safely
    try {
      userData.preferred_language = language || "ru";
    } catch (e) {
      console.warn("Could not set preferred_language on user data", e);
    }

    const user = await prisma.user.create({
      data: userData,
    })

    await logAuditAction({
      userId: user.id,
      action: "REGISTRATION_SUCCESS",
      ipAddress: ip
    });

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
  await ensureSchemaFixed()
  const cookieStore = await cookies()
  const userId = cookieStore.get("session_user_id")?.value

  if (!userId) return null

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        full_name: true,
        avatar_url: true,
        role: true,
        created_at: true,
        // @ts-ignore
        // preferred_language: true,
      }
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
        // @ts-ignore
        preferred_language: user.preferred_language || "ru",
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
    const user = await prisma.user.findUnique({ 
      where: { email },
      select: {
        id: true,
        email: true,
        // @ts-ignore
        // preferred_language: true,
      }
    });

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
    // @ts-ignore
    const lang = (user as any).preferred_language === 'cn' ? 'cn' : 'ru';
    const subjects = {
      ru: t("welcome.recovery.emailSubject", "ru"),
      cn: t("welcome.recovery.emailSubject", "cn")
    };

    await sendEmail({
      to: user.email,
      subject: subjects[lang],
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #0f172a;">Golden Russia</h2>
          <p>${t("welcome.recovery.emailHello", lang)}</p>
          <p>${t("welcome.recovery.emailBody", lang)}</p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${resetUrl}" style="background-color: #0f172a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              ${t("welcome.recovery.emailAction", lang)}
            </a>
          </div>
          <p style="font-size: 12px; color: #64748b;">
            ${t("welcome.recovery.emailExpire", lang)}<br>
            ${t("welcome.recovery.emailSecurity", lang)}
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
      select: {
        expires_at: true,
        user: {
          select: {
            id: true,
            email: true,
            // @ts-ignore
            // preferred_language: true,
          }
        }
      }
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
    // @ts-ignore
    const lang = (user as any).preferred_language === 'cn' ? 'cn' : 'ru';
    await sendEmail({
      to: user.email,
      subject: t("welcome.recovery.changeNotificationSubject", lang),
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #0f172a;">Golden Russia</h2>
          <p>${t("welcome.recovery.changeNotificationBody", lang)}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 10px; color: #94a3b8; text-align: center;">GOLDEN RUSSIA &copy; 2024</p>
        </div>
      `
    });

    // 6. Invalidate active sessions
    // To invalidate sessions, we can update a `session_version` or similar in the User table,
    // and check it in getSession. For now, we delete the current session cookie.
    const cookieStore = await cookies();
    cookieStore.delete("session_user_id");
    
    return { success: true };
  } catch (error) {
    console.error("Reset password error:", error);
    return { error: "errorUnknown" };
  }
}
