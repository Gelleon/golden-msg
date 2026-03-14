"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Globe, Building2, MessageSquare, ArrowRight, ShieldCheck, Languages } from "lucide-react"
import { login, register } from "@/app/actions/auth"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const authSchema = z.object({
  email: z.string().email("Неверный формат email"),
  password: z.string().min(6, "Пароль должен быть не менее 6 символов"),
  fullName: z.string().optional(),
})

type AuthSchema = z.infer<typeof authSchema>

export function WelcomeScreen() {
  const [language, setLanguage] = useState<"ru" | "cn" | null>(null)
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const form = useForm<AuthSchema>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
    },
  })

  const text = {
    ru: {
      heroTitle: "Бизнес без границ",
      heroSubtitle: "Эффективное взаимодействие между Россией и Китаем с поддержкой ИИ-перевода.",
      welcome: "Добро пожаловать",
      subtitle: "Войдите или зарегистрируйтесь для продолжения",
      login: "Вход",
      register: "Регистрация",
      email: "Email",
      password: "Пароль",
      fullName: "Полное имя",
      submit: isLogin ? "Войти в систему" : "Создать аккаунт",
      toggle: isLogin ? "Нет аккаунта? Зарегистрироваться" : "Уже есть аккаунт? Войти",
      loading: "Обработка...",
      error: "Ошибка",
      features: [
        { icon: Globe, text: "Мгновенный ИИ-перевод (RU/CN)", desc: "Общайтесь свободно на своем языке" },
        { icon: MessageSquare, text: "Голосовые с транскрибацией", desc: "Голос в текст в реальном времени" },
        { icon: ShieldCheck, text: "Защищенные чаты", desc: "Шифрование и безопасность данных" },
      ]
    },
    cn: {
      heroTitle: "商业无国界",
      heroSubtitle: "支持AI翻译的俄罗斯与中国之间的高效互动。",
      welcome: "欢迎回来",
      subtitle: "登录或注册以继续",
      login: "登录",
      register: "注册",
      email: "电子邮箱",
      password: "密码",
      fullName: "全名",
      submit: isLogin ? "登录系统" : "创建账户",
      toggle: isLogin ? "没有账号？立即注册" : "已有账号？立即登录",
      loading: "处理中...",
      error: "错误",
      features: [
        { icon: Globe, text: "即时AI翻译 (俄/中)", desc: "使用母语自由交流" },
        { icon: MessageSquare, text: "语音消息转文字", desc: "实时语音转文本" },
        { icon: ShieldCheck, text: "安全聊天室", desc: "数据加密与安全保障" },
      ]
    },
  }

  const t = language ? text[language] : text.ru

  async function onSubmit(data: AuthSchema) {
    setIsLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append("email", data.email)
    formData.append("password", data.password)
    if (!isLogin && data.fullName) {
      formData.append("fullName", data.fullName)
    }
    if (language) {
      formData.append("language", language)
    }

    try {
      let result
      if (isLogin) {
        result = await login(formData)
      } else {
        result = await register(formData)
      }

      if (result.error) {
        setError(result.error)
      } else {
        router.push("/dashboard")
      }
    } catch (err: any) {
      console.error("Auth error:", err)
      setError("Произошла ошибка при аутентификации")
    } finally {
      setIsLoading(false)
    }
  }

  // Language Selection Screen
  if (!language) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0c10] relative overflow-hidden font-sans">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
              x: [0, 50, 0],
              y: [0, -50, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-900/20 rounded-full blur-[120px]" 
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
              x: [0, -70, 0],
              y: [0, 70, 0]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-amber-500/10 rounded-full blur-[120px]" 
          />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-[0.03] mix-blend-overlay" />
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
               <span className="text-xl md:text-2xl font-bold text-white tracking-[0.1em] md:tracking-[0.2em]">GOLDEN RUSSIA</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter text-white leading-[0.95] md:leading-[0.9]"
            >
              Бизнес <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-amber-200 to-secondary">
                Без Границ
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light px-4"
            >
              Выберите язык для продолжения / 请选择语言
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 w-full max-w-2xl mx-auto px-4">
            <motion.button
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setLanguage("ru")}
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
                Русский
              </motion.span>
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-xs md:text-sm text-slate-400 font-light"
              >
                Для пользователей из РФ
              </motion.span>
              <div className="mt-4 md:mt-6 flex items-center text-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                <span className="text-xs md:text-sm font-medium mr-2">Продолжить</span>
                <ArrowRight className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </div>
            </motion.button>

            <motion.button
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setLanguage("cn")}
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
                中文
              </motion.span>
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 }}
                className="text-xs md:text-sm text-slate-400 font-light"
              >
                中国用户请点击
              </motion.span>
              <div className="mt-4 md:mt-6 flex items-center text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                <span className="text-xs md:text-sm font-medium mr-2">继续</span>
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
          GOLDEN RUSSIA &copy; {new Date().getFullYear()} • ELITE BUSINESS NETWORK
        </motion.div>
      </div>
    )
  }

  // Auth Screen
  return (
    <div className="min-h-screen flex bg-[#0a0c10] overflow-hidden font-sans">
      <AnimatePresence mode="wait">
        <motion.div 
          key={language}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="flex w-full min-h-screen"
        >
          {/* Left Panel - Hero (Hidden on Mobile) */}
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-20 overflow-hidden border-r border-white/5"
          >
            {/* Background Layers */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a0c10] via-primary to-black" />
            <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay" />
            
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
                <span className="text-2xl font-black tracking-[0.2em]">GOLDEN RUSSIA</span>
              </motion.div>
              
              <div className="space-y-6">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-5xl font-black leading-[1.1] tracking-tight"
                >
                  {t.heroTitle}
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="text-xl text-slate-400 font-light leading-relaxed"
                >
                  {t.heroSubtitle}
                </motion.p>
              </div>

              <div className="space-y-8 pt-10">
                {t.features.map((feature, idx) => (
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

            {/* Abstract Decorations */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-secondary/10 rounded-full blur-[100px]" />
            <div className="absolute -bottom-40 -left-20 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px]" />
          </motion.div>

          {/* Right Panel - Form */}
          <motion.div 
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 flex flex-col justify-center px-4 sm:px-12 md:px-16 lg:px-24 bg-[#0a0c10] relative"
          >
            <div className="absolute top-6 right-6 md:top-10 md:right-10">
               <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setLanguage(null)} 
                  className="gap-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl border border-white/5 text-xs md:text-sm"
               >
                  <Languages className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  {language === 'ru' ? 'Сменить язык' : '切换语言'}
               </Button>
            </div>

            <div className="max-w-md w-full mx-auto space-y-8 md:space-y-10">
              <div className="space-y-2 text-center lg:text-left">
                <motion.h2 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl md:text-4xl font-black text-white tracking-tight"
                >
                  {t.welcome}
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-slate-500 font-light text-sm md:text-base"
                >
                  {t.subtitle}
                </motion.p>
              </div>

              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 md:space-y-6">
                <div className="space-y-4 md:space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-300 text-xs md:text-sm font-medium ml-1">{t.email}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      {...form.register("email")}
                      className="h-12 md:h-14 bg-white/[0.03] border-white/10 text-white rounded-2xl focus:border-secondary focus:ring-secondary/20 transition-all placeholder:text-slate-600 text-sm md:text-base"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password"className="text-slate-300 text-xs md:text-sm font-medium ml-1">{t.password}</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      {...form.register("password")}
                      className="h-12 md:h-14 bg-white/[0.03] border-white/10 text-white rounded-2xl focus:border-secondary focus:ring-secondary/20 transition-all placeholder:text-slate-600 text-sm md:text-base"
                      required
                    />
                  </div>

                  {!isLogin && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-2 overflow-hidden"
                    >
                      <Label htmlFor="fullName" className="text-slate-300 text-xs md:text-sm font-medium ml-1">{t.fullName}</Label>
                      <Input
                        id="fullName"
                        placeholder="Имя Фамилия"
                        {...form.register("fullName")}
                        className="h-12 md:h-14 bg-white/[0.03] border-white/10 text-white rounded-2xl focus:border-secondary focus:ring-secondary/20 transition-all placeholder:text-slate-600 text-sm md:text-base"
                        required={!isLogin}
                      />
                    </motion.div>
                  )}
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3 md:p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-xs md:text-sm flex items-center"
                  >
                    <ShieldCheck className="h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-3 flex-shrink-0" />
                    {error}
                  </motion.div>
                )}

                <Button 
                  className="w-full h-12 md:h-14 text-base md:text-lg font-bold rounded-2xl bg-secondary text-slate-950 [text-shadow:0_0.5px_0_rgba(255,255,255,0.4)] hover:bg-secondary/90 shadow-[0_10px_30px_rgba(251,191,36,0.15)] hover:shadow-[0_15px_40px_rgba(251,191,36,0.25)] transition-all transform hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0c10]" 
                  type="submit" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-5 w-5 md:h-6 md:w-6 animate-spin" />
                  ) : (
                    <span className="flex items-center justify-center">
                      {t.submit} <ArrowRight className="ml-2 md:ml-3 h-4 w-4 md:h-5 md:w-5" />
                    </span>
                  )}
                </Button>
              </form>

              <div className="relative pt-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/5" />
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-widest">
                  <span className="bg-[#0a0c10] px-4 text-slate-600">
                    {isLogin ? "Или" : "Аккаунт"}
                  </span>
                </div>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-slate-400 hover:text-secondary text-sm font-medium transition-colors"
                >
                  {t.toggle}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
