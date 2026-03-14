"use client"

import { useState, useRef } from "react"
import { updateProfile } from "@/app/actions/users"
import { uploadFile } from "@/app/actions/upload"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, User, Lock, Camera, Check, AlertCircle, Globe } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export function SettingsForm({ user }: { user: any }) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("profile")
  
  return (
    <div className="flex-1 h-full bg-slate-50/50">
      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 animate-fade-in">
        <header className="space-y-1">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold tracking-tight text-slate-900"
          >
            Настройки
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500"
          >
            Управление вашим профилем, безопасностью и предпочтениями.
          </motion.p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white/50 backdrop-blur-sm border border-slate-200 p-1 rounded-xl w-full md:w-auto overflow-x-auto inline-flex whitespace-nowrap">
            <TabsTrigger 
              value="profile" 
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white px-6 py-2 transition-all duration-300"
            >
              <User className="h-4 w-4" />
              Профиль
            </TabsTrigger>
            <TabsTrigger 
              value="security" 
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white px-6 py-2 transition-all duration-300"
            >
              <Lock className="h-4 w-4" />
              Безопасность
            </TabsTrigger>
            <TabsTrigger 
              value="language" 
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white px-6 py-2 transition-all duration-300"
            >
              <Globe className="h-4 w-4" />
              Язык и Регион
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <TabsContent value="profile" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                <ProfileForm user={user} toast={toast} />
              </TabsContent>

              <TabsContent value="security" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                <SecurityForm toast={toast} />
              </TabsContent>

              <TabsContent value="language" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                <LanguageForm user={user} toast={toast} />
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  )
}

function ProfileForm({ user, toast }: { user: any, toast: any }) {
  const [isLoading, setIsLoading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || "")
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    const result = await uploadFile(formData)
    if (result.success && result.url) {
      setAvatarUrl(result.url)
      // Automatically update profile with new avatar URL
      const profileData = new FormData()
      profileData.append("avatarUrl", result.url)
      await updateProfile(profileData)
      
      toast({
        title: "Фото обновлено",
        description: "Ваш аватар успешно сохранен.",
      })
    } else {
      toast({
        title: "Ошибка",
        description: result.error || "Не удалось загрузить фото",
        variant: "destructive",
      })
    }
    setIsUploading(false)
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    if (avatarUrl) {
      formData.append("avatarUrl", avatarUrl)
    }
    
    const result = await updateProfile(formData)

    if (result.success) {
      toast({
        title: "Профиль обновлен",
        description: "Ваши данные успешно сохранены.",
      })
    } else {
      toast({
        title: "Ошибка",
        description: result.error || "Не удалось обновить профиль.",
        variant: "destructive",
      })
    }
    setIsLoading(false)
  }

  return (
    <Card className="border-none shadow-xl bg-white/70 backdrop-blur-md rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-900 to-slate-900 text-white p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
            <Avatar className="h-20 w-20 md:h-24 md:w-24 border-4 border-white/20 shadow-2xl transition-transform duration-300 group-hover:scale-105">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="bg-blue-100 text-blue-900 text-xl md:text-2xl font-bold">
                {user?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Camera className="text-white h-6 w-6 md:h-8 md:w-8" />
            </div>
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
                <Loader2 className="text-white h-6 w-6 md:h-8 md:w-8 animate-spin" />
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*"
            />
          </div>
          <div className="text-center md:text-left space-y-1">
            <CardTitle className="text-xl md:text-2xl font-bold">{user?.full_name || "Пользователь"}</CardTitle>
            <CardDescription className="text-blue-100/70 text-sm md:text-base">
              {user?.email} • {user?.role === "admin" ? "Администратор" : user?.role === "manager" ? "Менеджер" : "Партнер"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-slate-700 text-sm md:text-base font-medium">Полное имя</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input 
                  id="fullName" 
                  name="fullName" 
                  placeholder="Введите ваше имя" 
                  defaultValue={user?.full_name || ""} 
                  className="pl-10 bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-10 md:h-11 text-sm md:text-base"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 text-sm md:text-base font-medium">Электронная почта</Label>
              <Input 
                id="email" 
                value={user?.email} 
                disabled 
                className="bg-slate-100/50 border-slate-200 text-slate-500 cursor-not-allowed rounded-xl h-10 md:h-11 text-sm md:text-base"
              />
              <p className="text-[10px] md:text-[11px] text-slate-400 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> Электронную почту нельзя изменить самостоятельно
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-slate-50/50 border-t border-slate-100 p-4 md:p-6 flex justify-end">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/20"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Сохранение...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Сохранить профиль
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

function SecurityForm({ toast }: { toast: any }) {
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const password = formData.get("password") as string
    const confirm = formData.get("confirmPassword") as string
    
    if (password !== confirm) {
      toast({
        title: "Ошибка",
        description: "Пароли не совпадают.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    const result = await updateProfile(formData)

    if (result.success) {
      toast({
        title: "Пароль обновлен",
        description: "Ваш пароль был успешно изменен.",
      })
      ;(event.target as HTMLFormElement).reset()
    } else {
      toast({
        title: "Ошибка",
        description: result.error || "Не удалось обновить пароль.",
        variant: "destructive",
      })
    }
    setIsLoading(false)
  }

  return (
    <Card className="border-none shadow-xl bg-white/70 backdrop-blur-md rounded-2xl overflow-hidden">
      <CardHeader className="p-6 md:p-8 pb-4">
        <CardTitle className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
          <Lock className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
          Безопасность аккаунта
        </CardTitle>
        <CardDescription className="text-xs md:text-sm text-slate-500">
          Регулярная смена пароля помогает защитить ваш аккаунт от несанкционированного доступа.
        </CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="p-6 md:p-8 pt-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm md:text-base">Новый пароль</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                required 
                minLength={6} 
                className="bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-10 md:h-11 text-sm md:text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm md:text-base">Подтвердите новый пароль</Label>
              <Input 
                id="confirmPassword" 
                name="confirmPassword" 
                type="password" 
                required 
                minLength={6} 
                className="bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-10 md:h-11 text-sm md:text-base"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-slate-50/50 border-t border-slate-100 p-4 md:p-6 flex justify-end">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full md:w-auto bg-slate-900 hover:bg-slate-800 text-white px-8 py-2 rounded-xl transition-all duration-300 shadow-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Обновление...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Обновить пароль
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

function LanguageForm({ user, toast }: { user: any, toast: any }) {
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const result = await updateProfile(formData)

    if (result.success) {
      toast({
        title: "Настройки сохранены",
        description: "Языковые предпочтения обновлены.",
      })
      // Optionally refresh page or update global state to change UI language
    } else {
      toast({
        title: "Ошибка",
        description: result.error || "Не удалось сохранить настройки.",
        variant: "destructive",
      })
    }
    setIsLoading(false)
  }

  return (
    <Card className="border-none shadow-xl bg-white/70 backdrop-blur-md rounded-2xl overflow-hidden">
      <CardHeader className="p-6 md:p-8 pb-4">
        <CardTitle className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
          <Globe className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
          Язык и региональные настройки
        </CardTitle>
        <CardDescription className="text-xs md:text-sm text-slate-500">
          Выберите язык интерфейса и другие параметры локализации.
        </CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="p-6 md:p-8 pt-4 space-y-6">
          <div className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="language" className="text-slate-700 text-sm md:text-base font-medium">Язык интерфейса</Label>
              <Select name="language" defaultValue={user?.preferred_language || "ru"}>
                <SelectTrigger className="bg-slate-50 border-slate-200 focus:ring-blue-500 rounded-xl h-10 md:h-11 text-sm md:text-base">
                  <SelectValue placeholder="Выберите язык" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200">
                  <SelectItem value="ru" className="focus:bg-blue-50 focus:text-blue-600 cursor-pointer py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🇷🇺</span>
                      <div className="flex flex-col">
                        <span className="font-medium">Русский</span>
                        <span className="text-xs text-slate-400">Russian</span>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="cn" className="focus:bg-blue-50 focus:text-blue-600 cursor-pointer py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🇨🇳</span>
                      <div className="flex flex-col">
                        <span className="font-medium">中文</span>
                        <span className="text-xs text-slate-400">Chinese</span>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
              <p className="text-xs md:text-sm text-blue-700 leading-relaxed">
                Настройки языка применяются мгновенно ко всему интерфейсу приложения, включая чаты и системные уведомления.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-slate-50/50 border-t border-slate-100 p-4 md:p-6 flex justify-end">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/20"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Применение...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Применить настройки
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

