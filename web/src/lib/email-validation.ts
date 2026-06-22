import { z } from "zod"

export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase()
}

const emailSchema = z
  .string()
  .trim()
  .min(3)
  .max(254)
  .email()
  .refine(
    (email) => {
      if (/\s/.test(email)) return false
      if (email.includes("..")) return false
      const [local] = email.split("@")
      if (!local) return false
      return true
    },
    { message: "invalid" }
  )

export function parseEmail(
  raw: string
): { ok: true; email: string } | { ok: false; error: "emailError" } {
  const result = emailSchema.safeParse(raw)
  if (!result.success) {
    return { ok: false, error: "emailError" }
  }
  return { ok: true, email: normalizeEmail(result.data) }
}
