"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { motion } from "framer-motion"
import { Loader2, Lock, ShieldCheck, CheckCircle2 } from "lucide-react"
import { resetPassword } from "@/app/actions/auth"
import { useTranslation } from "@/lib/language-context"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChinaRussiaBackground } from "@/components/china-russia-background"

export function ResetPasswordForm() {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const schema = z.object({
    password: z.string().min(8, t("welcome.recovery.passwordComplexity")),
    confirmPassword: z.string()
  }).refine((data) => data.password === data.confirmPassword, {
    message: t("welcome.recovery.confirmPasswordError") || "Passwords do not match",
    path: ["confirmPassword"],
  })

  type Schema = z.infer<typeof schema>

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirmPassword: "" },
  })

  async function onSubmit(data: Schema) {
    if (!token) {
      setError(t("welcome.recovery.errorTokenInvalid"))
      return
    }

    setIsLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append("token", token)
    formData.append("password", data.password)

    try {
      const result = await resetPassword(formData)
      if (result.error) {
        setError(t(result.error as any))
      } else {
        setIsSuccess(true)
        setTimeout(() => router.push("/"), 3000)
      }
    } catch (err) {
      setError(t("welcome.errorUnknown"))
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d1117] relative p-4">
        <ChinaRussiaBackground />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-md bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 text-center space-y-6"
        >
          <div className="flex justify-center">
            <div className="p-4 bg-green-500/10 rounded-full border border-green-500/20">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">{t("welcome.recovery.resetSuccess")}</h2>
            <p className="text-slate-400 font-light">{t("welcome.recovery.resetSuccessDesc")}</p>
          </div>
          <Button 
            className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-2xl"
            onClick={() => router.push("/")}
          >
            {t("welcome.recovery.backToLogin")}
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1117] relative p-4">
      <ChinaRussiaBackground />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 space-y-8"
      >
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-black text-white tracking-tight">{t("welcome.recovery.resetTitle")}</h2>
          <p className="text-slate-500 font-light text-sm">{t("welcome.recovery.resetDesc")}</p>
        </div>

        {!token ? (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-center">
            {t("welcome.recovery.errorTokenInvalid")}
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" title={t("welcome.recovery.passwordComplexity")} className="text-slate-300 text-xs md:text-sm font-medium ml-1">
                  {t("welcome.recovery.newPassword")}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...form.register("password")}
                    className="h-12 md:h-14 bg-white/[0.05] border-white/10 text-white rounded-2xl focus:border-secondary focus:ring-secondary/20 transition-all pl-12"
                    required
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                </div>
                <p className="text-[10px] text-slate-500 ml-1 font-light italic">
                  {t("recovery.passwordComplexity")}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-300 text-xs md:text-sm font-medium ml-1">
                  {t("welcome.recovery.confirmPassword")}
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...form.register("confirmPassword")}
                    className="h-12 md:h-14 bg-white/[0.05] border-white/10 text-white rounded-2xl focus:border-secondary focus:ring-secondary/20 transition-all pl-12"
                    required
                  />
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                </div>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-xs md:text-sm"
              >
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 md:h-14 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-2xl shadow-xl shadow-amber-500/20 transition-all duration-300"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                t("welcome.recovery.resetSubmit")
              )}
            </Button>
          </form>
        )}
      </motion.div>
    </div>
  )
}
