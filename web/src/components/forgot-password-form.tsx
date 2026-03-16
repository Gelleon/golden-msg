"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { motion } from "framer-motion"
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from "lucide-react"
import { forgotPassword } from "@/app/actions/auth"
import { useTranslation } from "@/lib/language-context"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ForgotPasswordFormProps {
  onBack: () => void;
}

export function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const schema = z.object({
    email: z.string().email(t("welcome.emailError")),
  })

  type Schema = z.infer<typeof schema>

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
    mode: "onChange",
  })

  const [captchaAnswer, setCaptchaAnswer] = useState<{ num1: number, num2: number, sum: number } | null>(null)
  const [captchaInput, setCaptchaInput] = useState("")

  useEffect(() => {
    generateCaptcha()
  }, [])

  function generateCaptcha() {
    const num1 = Math.floor(Math.random() * 10) + 1
    const num2 = Math.floor(Math.random() * 10) + 1
    setCaptchaAnswer({ num1, num2, sum: num1 + num2 })
    setCaptchaInput("")
  }

  async function onSubmit(data: Schema) {
    if (!captchaAnswer || parseInt(captchaInput) !== captchaAnswer.sum) {
      setError(t("welcome.recovery.errorCaptcha") || "Incorrect captcha")
      generateCaptcha()
      return
    }

    setIsLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append("email", data.email)

    try {
      const result = await forgotPassword(formData)
      if (result.error) {
        setError(t(result.error as any))
      } else {
        setIsSuccess(true)
      }
    } catch (err) {
      setError(t("welcome.errorUnknown"))
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 text-center"
      >
        <div className="flex justify-center">
          <div className="p-4 bg-green-500/10 rounded-full border border-green-500/20">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white">{t("welcome.recovery.success")}</h2>
          <p className="text-slate-400 font-light">{t("welcome.recovery.successDesc")}</p>
        </div>
        <Button 
          className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-2xl"
          onClick={onBack}
        >
          {t("welcome.recovery.backToLogin")}
        </Button>
      </motion.div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack}
          className="mb-4 -ml-2 gap-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("welcome.recovery.backToLogin")}
        </Button>
        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
          {t("welcome.recovery.title")}
        </h2>
        <p className="text-slate-500 font-light text-sm md:text-base">
          {t("welcome.recovery.description")}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-300 text-xs md:text-sm font-medium ml-1">
            {t("welcome.recovery.email")}
          </Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder={t("welcome.recovery.emailPlaceholder")}
              {...register("email")}
              className="h-12 md:h-14 bg-white/[0.05] border-white/10 text-white rounded-2xl focus:border-secondary focus:ring-secondary/20 transition-all pl-12"
            />
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
          </div>
          {errors.email && (
            <p className="text-xs text-red-400 ml-1">{errors.email.message}</p>
          )}
        </div>

        {captchaAnswer && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <Label className="text-slate-300 text-xs md:text-sm font-medium ml-1">
              {t("welcome.recovery.captchaLabel") || "Security Check"}
            </Label>
            <div className="flex gap-4 items-center">
              <div className="flex-1 h-12 md:h-14 bg-white/[0.05] border border-white/10 text-white rounded-2xl flex items-center justify-center font-bold text-lg tracking-wider select-none">
                {captchaAnswer.num1} + {captchaAnswer.num2} = ?
              </div>
              <Input
                type="number"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                placeholder="?"
                className="w-24 h-12 md:h-14 bg-white/[0.05] border-white/10 text-white rounded-2xl focus:border-secondary focus:ring-secondary/20 transition-all text-center text-lg font-bold"
                required
              />
            </div>
          </div>
        )}

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
            t("welcome.recovery.submit")
          )}
        </Button>
      </form>
    </div>
  )
}
