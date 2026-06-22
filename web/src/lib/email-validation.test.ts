import { normalizeEmail, parseEmail } from "@/lib/email-validation"

describe("email-validation", () => {
  describe("normalizeEmail", () => {
    it("trims and lowercases email", () => {
      expect(normalizeEmail("  User@Mail.COM  ")).toBe("user@mail.com")
    })
  })

  describe("parseEmail", () => {
    it("accepts valid emails and normalizes them", () => {
      expect(parseEmail("User@Example.com")).toEqual({
        ok: true,
        email: "user@example.com",
      })
    })

    it("rejects empty and too-short strings", () => {
      expect(parseEmail("")).toEqual({ ok: false, error: "emailError" })
      expect(parseEmail("a@")).toEqual({ ok: false, error: "emailError" })
    })

    it("rejects invalid formats", () => {
      expect(parseEmail("not-an-email")).toEqual({ ok: false, error: "emailError" })
      expect(parseEmail("@example.com")).toEqual({ ok: false, error: "emailError" })
      expect(parseEmail("user@")).toEqual({ ok: false, error: "emailError" })
    })

    it("rejects emails with spaces or double dots", () => {
      expect(parseEmail("user @example.com")).toEqual({ ok: false, error: "emailError" })
      expect(parseEmail("user..name@example.com")).toEqual({ ok: false, error: "emailError" })
    })

    it("rejects emails longer than 254 characters", () => {
      const longLocal = "a".repeat(250)
      expect(parseEmail(`${longLocal}@example.com`)).toEqual({ ok: false, error: "emailError" })
    })
  })
})
