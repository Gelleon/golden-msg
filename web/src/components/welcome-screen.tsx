"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Globe, Building2, MessageSquare, ArrowRight, ShieldCheck, Languages } from "lucide-react"
import { login, register } from "@/app/actions/auth"
import { useTranslation } from "@/lib/language-context"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChinaRussiaBackground } from "@/components/china-russia-background"
import { ForgotPasswordForm } from "@/components/forgot-password-form"

export function WelcomeScreen() {
  const { t, setLanguage, language } = useTranslation()
  const [hasConfirmedLanguage, setHasConfirmedLanguage] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const authSchema = z.object({
    email: z.string().email(t("welcome.emailError")),
    password: z.string().min(6, t("welcome.passwordError")),
    fullName: z.string().optional(),
  })

  type AuthSchema = z.infer<typeof authSchema>

  const form = useForm<AuthSchema>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
    },
    mode: "onChange",
  })

  const features = [
    { 
      icon: Globe, 
      text: t("welcome.features.translation.title"), 
      desc: t("welcome.features.translation.desc") 
    },
    { 
      icon: MessageSquare, 
      text: t("welcome.features.voice.title"), 
      desc: t("welcome.features.voice.desc") 
    },
    { 
      icon: ShieldCheck, 
      text: t("welcome.features.security.title"), 
      desc: t("welcome.features.security.desc") 
    },
  ]

  async function onSubmit(data: AuthSchema) {
    setIsLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append("email", data.email)
    formData.append("password", data.password)
    if (!isLogin && data.fullName) {
      formData.append("fullName", data.fullName)
    }
    formData.append("language", language)

    try {
      let result
      if (isLogin) {
        result = await login(formData)
      } else {
        result = await register(formData)
      }

      if (result.error) {
        // Map error code to translation key if possible, otherwise use as is
        const errorKey = `welcome.${result.error}`
        const translatedError = t(errorKey as any)
        setError(translatedError === errorKey ? result.error : translatedError)
      } else {
        router.push("/dashboard")
      }
    } catch (err: any) {
      console.error("Auth error:", err)
      setError(t("welcome.authError"))
    } finally {
      setIsLoading(false)
    }
  }

  // Language Selection Screen
  if (!hasConfirmedLanguage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d1117] relative overflow-hidden font-sans">
        {/* Cultural Background Component */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <ChinaRussiaBackground />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="z-10 text-center space-y-12 max-w-5xl px-4"
        >
          <div className="space-y-4 md:space-y-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center justify-center p-2.5 md:p-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl mb-2 md:mb-4"
            >
               <Building2 className="h-8 w-8 md:h-10 md:w-10 text-secondary mr-2 md:mr-3" />
               <span className="text-xl md:text-2xl font-bold text-white tracking-[0.1em] md:tracking-[0.2em]">{t("welcome.brandName")}</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter text-white leading-[0.95] md:leading-[0.9]"
            >
              {t("welcome.heroTitle").split(" ")[0]} <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-amber-200 to-secondary">
                {t("welcome.heroTitle").split(" ").slice(1).join(" ")}
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light px-4"
            >
              {t("welcome.chooseLanguage")}
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 w-full max-w-2xl mx-auto px-4">
            <motion.button
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setLanguage("ru")
                setHasConfirmedLanguage(true)
              }}
              className="group relative flex flex-col items-center p-6 md:p-10 bg-white/[0.03] backdrop-blur-xl rounded-[2rem] md:rounded-[2.5rem] border border-white/10 transition-all duration-500 hover:bg-white/[0.08] hover:border-white/20 shadow-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-5xl md:text-6xl mb-4 md:mb-6 transform group-hover:scale-110 transition-transform duration-500"
              >
                🇷🇺
              </motion.div>
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2"
              >
                {t("welcome.russian")}
              </motion.span>
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-xs md:text-sm text-slate-400 font-light"
              >
                {t("welcome.russianDesc")}
              </motion.span>
              <div className="mt-4 md:mt-6 flex items-center text-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                <span className="text-xs md:text-sm font-medium mr-2">{t("welcome.continue")}</span>
                <ArrowRight className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </div>
            </motion.button>

            <motion.button
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setLanguage("cn")
                setHasConfirmedLanguage(true)
              }}
              className="group relative flex flex-col items-center p-6 md:p-10 bg-white/[0.03] backdrop-blur-xl rounded-[2rem] md:rounded-[2.5rem] border border-white/10 transition-all duration-500 hover:bg-white/[0.08] hover:border-white/20 shadow-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-5xl md:text-6xl mb-4 md:mb-6 transform group-hover:scale-110 transition-transform duration-500"
              >
                🇨🇳
              </motion.div>
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2"
              >
                {t("welcome.chinese")}
              </motion.span>
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 }}
                className="text-xs md:text-sm text-slate-400 font-light"
              >
                {t("welcome.chineseDesc")}
              </motion.span>
              <div className="mt-4 md:mt-6 flex items-center text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                <span className="text-xs md:text-sm font-medium mr-2">{t("welcome.continue")}</span>
                <ArrowRight className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </div>
            </motion.button>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-10 text-slate-500 text-sm tracking-widest font-light"
        >
          {t("welcome.footer").replace("{year}", new Date().getFullYear().toString())}
        </motion.div>
      </div>
    )
  }

  // Auth Screen
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#0d1117] relative overflow-hidden font-sans">
      {/* Cultural Background Component for full screen */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <ChinaRussiaBackground />
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div 
          key={isLogin ? "login" : "register"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="flex w-full min-h-screen relative z-10"
        >
          {/* Left Panel - Hero (Hidden on Mobile) */}
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-20 overflow-hidden border-r border-white/5"
          >
            
            <div className="relative z-10 max-w-lg w-full text-white space-y-12">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-4"
              >
                <div className="p-3 bg-secondary rounded-2xl shadow-[0_0_30px_rgba(251,191,36,0.2)]">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <span className="text-2xl font-black tracking-[0.2em]">{t("welcome.brandName")}</span>
              </motion.div>
              
              <div className="space-y-6">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-5xl font-black leading-[1.1] tracking-tight"
                >
                  {t("welcome.heroTitle")}
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="text-xl text-slate-400 font-light leading-relaxed"
                >
                  {t("welcome.heroSubtitle")}
                </motion.p>
              </div>

              <div className="space-y-8 pt-10">
                {features.map((feature, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + idx * 0.1 }}
                    className="flex items-start gap-5 group"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-secondary transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(251,191,36,0.3)]">
                      <feature.icon className="h-6 w-6 text-secondary group-hover:text-primary transition-colors" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg group-hover:text-secondary transition-colors">{feature.text}</h4>
                      <p className="text-slate-500 text-sm font-light">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Panel - Form */}
          <motion.div 
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 flex flex-col justify-center px-4 sm:px-12 md:px-16 lg:px-24 bg-transparent relative"
          >
            <div className="absolute top-6 right-6 md:top-10 md:right-10">
               <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setHasConfirmedLanguage(false)} 
                  className="gap-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl border border-white/5 text-xs md:text-sm"
               >
                  <Languages className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  {t("welcome.changeLanguage")}
               </Button>
            </div>

              <div className="max-w-md w-full mx-auto space-y-8 md:space-y-10">
                {showForgotPassword ? (
                  <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />
                ) : (
                  <>
                    <div className="space-y-2 text-center lg:text-left">
                      <motion.h2 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-4xl font-black text-white tracking-tight"
                      >
                        {isLogin ? t("welcome.welcomeBack") : t("welcome.createAccount")}
                      </motion.h2>
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-500 font-light text-sm md:text-base"
                      >
                        {isLogin ? t("welcome.subtitle") : t("welcome.registerSubtitle")}
                      </motion.p>
                    </div>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 md:space-y-6">
                      <div className="space-y-4 md:space-y-5">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-slate-300 text-xs md:text-sm font-medium ml-1">{t("welcome.email")}</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder={t("welcome.emailPlaceholder")}
                            {...form.register("email")}
                            className="h-12 md:h-14 bg-white/[0.05] border-white/10 text-white rounded-2xl focus:border-secondary focus:ring-secondary/20 transition-all placeholder:text-slate-500 text-sm md:text-base"
                          />
                          {form.formState.errors.email && (
                            <p className="text-xs text-red-400 ml-1">{form.formState.errors.email.message}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between ml-1">
                            <Label htmlFor="password"className="text-slate-300 text-xs md:text-sm font-medium">{t("welcome.password")}</Label>
                            {isLogin && (
                              <button
                                type="button"
                                onClick={() => setShowForgotPassword(true)}
                                className="text-[10px] md:text-xs text-secondary hover:text-amber-400 transition-colors font-medium"
                              >
                                {t("welcome.forgotPassword")}
                              </button>
                            )}
                          </div>
                          <Input
                            id="password"
                            type="password"
                            placeholder={t("welcome.passwordPlaceholder")}
                            {...form.register("password")}
                            className="h-12 md:h-14 bg-white/[0.05] border-white/10 text-white rounded-2xl focus:border-secondary focus:ring-secondary/20 transition-all placeholder:text-slate-500 text-sm md:text-base"
                          />
                          {form.formState.errors.password && (
                            <p className="text-xs text-red-400 ml-1">{form.formState.errors.password.message}</p>
                          )}
                        </div>

                        {!isLogin && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="space-y-2 overflow-hidden"
                          >
                            <Label htmlFor="fullName" className="text-slate-300 text-xs md:text-sm font-medium ml-1">{t("welcome.fullName")}</Label>
                            <Input
                              id="fullName"
                              placeholder={t("welcome.fullNamePlaceholder")}
                              {...form.register("fullName")}
                              className="h-12 md:h-14 bg-white/[0.05] border-white/10 text-white rounded-2xl focus:border-secondary focus:ring-secondary/20 transition-all placeholder:text-slate-500 text-sm md:text-base"
                            />
                            {form.formState.errors.fullName && (
                              <p className="text-xs text-red-400 ml-1">{form.formState.errors.fullName.message}</p>
                            )}
                          </motion.div>
                        )}
                      </div>

                      {error && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="p-3 md:p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-xs md:text-sm flex items-center"
                        >
                          <ShieldCheck className="h-4 w-4 mr-2 flex-shrink-0" />
                          {error}
                        </motion.div>
                      )}

                      <div className="space-y-4 pt-2">
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="w-full h-12 md:h-14 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-2xl shadow-xl shadow-amber-500/20 transition-all duration-300 text-sm md:text-base"
                        >
                          {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            isLogin ? t("welcome.submitLogin") : t("welcome.submitRegister")
                          )}
                        </Button>

                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setIsLogin(!isLogin)}
                          className="w-full h-12 md:h-14 text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all text-xs md:text-sm"
                        >
                          {isLogin ? t("welcome.toggleToRegister") : t("welcome.toggleToLogin")}
                        </Button>
                      </div>
                    </form>
                  </>
                )}
              </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
