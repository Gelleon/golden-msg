"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import { getUsers, updateUserRole, updateProfile } from "@/app/actions/users"
import { uploadFile } from "@/app/actions/upload"
import { NotificationManagementForm } from "./notification-management-form"
import { NotificationSettingsForm } from "./notification-settings-form"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Loader2, User, Lock, Camera, Check, AlertCircle, Globe, Users, ShieldCheck, Briefcase, UserCheck, UserCog, Search, Filter, MoreHorizontal, ChevronDown, Save, Bell, BarChart3 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/language-context"

export function SettingsForm({ user }: { user: any }) {
  const { toast } = useToast()
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "profile")

  const roleLabels: Record<string, string> = {
    admin: t('roles.admin'),
    manager: t('roles.manager'),
    partner: t('roles.partner'),
    client: t('roles.client'),
  }

  const roleIcons: Record<string, any> = {
    admin: ShieldCheck,
    manager: Briefcase,
    partner: UserCheck,
    client: Users,
  }

  const roleColors: Record<string, string> = {
    admin: "bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_12px_rgba(239,68,68,0.1)]",
    manager: "bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-[0_0_12px_rgba(59,130,246,0.1)]",
    partner: "bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.1)]",
    client: "bg-slate-500/10 text-slate-400 border-slate-500/20 shadow-[0_0_12px_rgba(100,116,139,0.1)]",
  }

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab && ["profile", "security", "language", "users", "notifications", "notifications_admin"].includes(tab)) {
      if (["users", "notifications_admin"].includes(tab) && user?.role !== "admin") {
        setActiveTab("profile")
      } else {
        setActiveTab(tab)
      }
    }
  }, [searchParams, user])
  
  return (
    <div className="flex-1 h-full min-h-full bg-[#F8FAFC] relative overflow-y-auto overflow-x-hidden pb-20">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-600/5 rounded-full blur-[100px] -ml-48 -mb-48" />
      
      <div className="max-w-5xl mx-auto px-4 py-6 md:px-6 md:py-8 space-y-6 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <header className="relative pb-5 border-b border-slate-200/60">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-slate-900 text-white rounded-md text-[9px] font-bold uppercase tracking-wider mb-0.5"
              >
                <ShieldCheck className="h-2.5 w-2.5 text-blue-400" />
                {t('settings.personalCabinet')}
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl leading-tight"
              >
                {t('common.settings')}
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xs md:text-sm text-slate-600 font-medium max-w-xl leading-relaxed"
              >
                {t('settings.description')}
              </motion.p>
            </div>
            <div className="hidden md:flex items-center gap-2.5 text-[9px] font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
              <div className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                <span>{t('settings.protected')}</span>
              </div>
              <span className="uppercase tracking-wider">{t('settings.secureConnection')}</span>
            </div>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 w-full max-w-full">
          <div className="sticky top-4 z-40 w-full">
            <TabsList className="bg-white/90 backdrop-blur-md border border-slate-200 p-1 rounded-xl shadow-md flex flex-wrap w-full justify-start md:justify-center h-auto gap-1">
              <TabsTrigger 
                value="profile" 
                className="flex flex-1 md:flex-none items-center justify-center gap-2 rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white px-3 py-2 text-xs font-bold transition-all whitespace-nowrap min-w-[120px]"
              >
                <User className="h-3.5 w-3.5" />
                {t('tabs.profile')}
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="flex flex-1 md:flex-none items-center justify-center gap-2 rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white px-3 py-2 text-xs font-bold transition-all whitespace-nowrap min-w-[120px]"
              >
                <Lock className="h-3.5 w-3.5" />
                {t('tabs.security')}
              </TabsTrigger>
              <TabsTrigger 
                value="language" 
                className="flex flex-1 md:flex-none items-center justify-center gap-2 rounded-lg data-[state=active]:bg-emerald-600 data-[state=active]:text-white px-3 py-2 text-xs font-bold transition-all whitespace-nowrap min-w-[120px]"
              >
                <Globe className="h-3.5 w-3.5" />
                {t('tabs.language')}
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="flex flex-1 md:flex-none items-center justify-center gap-2 rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white px-3 py-2 text-xs font-bold transition-all whitespace-nowrap min-w-[120px]"
              >
                <Bell className="h-3.5 w-3.5" />
                {t('tabs.notifications')}
              </TabsTrigger>
              {user?.role === "admin" && (
                <>
                  <TabsTrigger 
                    value="users" 
                    className="flex flex-1 md:flex-none items-center justify-center gap-2 rounded-lg data-[state=active]:bg-amber-600 data-[state=active]:text-white px-3 py-2 text-xs font-bold transition-all whitespace-nowrap min-w-[120px]"
                  >
                    <UserCog className="h-3.5 w-3.5" />
                    {t('tabs.users')}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="notifications_admin" 
                    className="flex flex-1 md:flex-none items-center justify-center gap-2 rounded-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white px-3 py-2 text-xs font-bold transition-all whitespace-nowrap min-w-[120px]"
                  >
                    <BarChart3 className="h-3.5 w-3.5" />
                    {t('tabs.notifications_admin')}
                  </TabsTrigger>
                </>
              )}
            </TabsList>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <TabsContent value="profile" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                <ProfileForm user={user} toast={toast} roleLabels={roleLabels} roleColors={roleColors} />
              </TabsContent>

              <TabsContent value="security" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                <SecurityForm toast={toast} />
              </TabsContent>

              <TabsContent value="language" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                <LanguageForm user={user} toast={toast} />
              </TabsContent>

              <TabsContent value="notifications" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                <NotificationSettingsForm user={user} />
              </TabsContent>

              {user?.role === "admin" && (
                <>
                  <TabsContent value="users" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                    <UsersManagementForm toast={toast} roleLabels={roleLabels} roleIcons={roleIcons} roleColors={roleColors} />
                  </TabsContent>
                  <TabsContent value="notifications_admin" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                    <NotificationManagementForm />
                  </TabsContent>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  )
}

function UsersManagementForm({ toast, roleLabels, roleIcons, roleColors }: { toast: any, roleLabels: Record<string, string>, roleIcons: Record<string, any>, roleColors: Record<string, string> }) {
  const { t } = useTranslation()
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [pendingChanges, setPendingChanges] = useState<Record<string, string>>({})

  const fetchUsers = async () => {
    setIsLoading(true)
    const data = await getUsers()
    setUsers(data)
    setPendingChanges({})
    setIsLoading(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleRoleSelect = (userId: string, newRole: string) => {
    const user = users.find(u => u.id === userId)
    if (!user) return

    if (user.role === newRole) {
      const newPending = { ...pendingChanges }
      delete newPending[userId]
      setPendingChanges(newPending)
    } else {
      setPendingChanges(prev => ({
        ...prev,
        [userId]: newRole
      }))
    }
  }

  const handleSaveChanges = async () => {
    const changesCount = Object.keys(pendingChanges).length
    if (changesCount === 0) return

    setIsSaving(true)
    let successCount = 0
    let lastError = ""

    try {
      for (const [userId, newRole] of Object.entries(pendingChanges)) {
        const result = await updateUserRole(userId, newRole)
        if (result.success) {
          successCount++
        } else {
          lastError = result.error || t('settings.users.updateRoleError')
        }
      }

      if (successCount === changesCount) {
        toast({
          title: t('common.changesSaved'),
          description: t('settings.users.updateRoleSuccess'),
        })
        await fetchUsers()
      } else if (successCount > 0) {
        toast({
          title: t('common.partialSuccess'),
          description: `${t('settings.users.partialUpdateError')} ${lastError}`,
          variant: "destructive",
        })
        await fetchUsers()
      } else {
        toast({
          title: t('common.error'),
          description: lastError || t('common.saveChangesError'),
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: t('common.criticalError'),
        description: t('common.saveChangesCriticalError'),
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const hasChanges = Object.keys(pendingChanges).length > 0

  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Card className="border border-slate-200/60 shadow-lg bg-white rounded-2xl overflow-hidden ring-1 ring-black/[0.03]">
      <CardHeader className="p-6 md:p-8 border-b border-slate-100 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[80px] -mr-32 -mt-32 rounded-full" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-900 rounded-xl shadow-lg shadow-slate-900/20 ring-2 ring-slate-900/5 shrink-0">
              <UserCog className="h-6 w-6 text-white" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{t('settings.users.title')}</CardTitle>
              <CardDescription className="text-slate-600 text-sm font-bold">{t('settings.users.description')}</CardDescription>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative group w-full md:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-slate-900 transition-colors z-10" />
              <Input
                placeholder={t('settings.users.searchPlaceholder')}
                className="pl-11 w-full h-11 bg-white border-2 border-slate-200 focus:border-slate-900 focus:ring-slate-900/5 rounded-xl text-sm font-bold transition-all shadow-sm placeholder:text-slate-400 placeholder:font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {hasChanges && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full md:w-auto"
              >
                <Button 
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  className="w-full md:w-auto h-11 px-6 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 group"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 transition-transform group-hover:scale-110" />
                  )}
                  {t('common.save').toUpperCase()} ({Object.keys(pendingChanges).length})
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="h-8 w-8 animate-spin text-slate-900 mb-4" />
            <p className="text-sm font-black text-slate-900 animate-pulse tracking-tight uppercase">{t('common.loading')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/80 border-b border-slate-100">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="pl-6 py-4 text-[10px] font-black text-slate-900 uppercase tracking-wider">{t('settings.users.user')}</TableHead>
                  <TableHead className="hidden md:table-cell py-4 text-[10px] font-black text-slate-900 uppercase tracking-wider">{t('settings.users.email')}</TableHead>
                  <TableHead className="py-4 text-[10px] font-black text-slate-900 uppercase tracking-wider">{t('settings.users.role')}</TableHead>
                  <TableHead className="pr-6 py-4 text-right text-[10px] font-black text-slate-900 uppercase tracking-wider">{t('settings.users.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-48 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="p-4 bg-slate-50 rounded-full border border-slate-100">
                          <Search className="h-6 w-6 text-slate-300" />
                        </div>
                        <p className="text-sm font-bold text-slate-500">{t('settings.users.noUsersFound')}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => {
                    const currentRole = pendingChanges[user.id] || user.role
                    const isPending = !!pendingChanges[user.id]
                    const RoleIcon = roleIcons[currentRole] || Users
                    return (
                      <TableRow key={user.id} className="group hover:bg-slate-50/50 border-slate-100 transition-colors">
                        <TableCell className="pl-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <Avatar className="h-10 w-10 rounded-lg border border-white shadow-md ring-1 ring-slate-200 transition-transform group-hover:scale-105 duration-300">
                                <AvatarImage src={user.avatar_url} className="object-cover" />
                                <AvatarFallback className="bg-slate-900 text-white font-black text-sm">
                                  {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">{user.full_name || t('settings.users.noName')}</span>
                              <span className="text-[10px] text-slate-500 font-bold md:hidden">{user.email}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell py-4">
                          <span className="text-sm font-bold text-slate-600">{user.email}</span>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex flex-col gap-1">
                            <div className={cn(
                              "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-wider shadow-sm transition-all duration-300",
                              roleColors[currentRole] || roleColors.client,
                              isPending && "ring-2 ring-amber-500/50 animate-pulse"
                            )}>
                              <RoleIcon className="h-3 w-3" />
                              {roleLabels[currentRole] || t('roles.client')}
                            </div>
                            {isPending && (
                              <span className="text-[8px] font-black text-amber-500 uppercase tracking-tighter ml-1">
                                {t('settings.users.notSaved')}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="pr-6 py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-9 w-9 p-0 rounded-lg hover:bg-slate-900 hover:text-white transition-all duration-300 border border-transparent hover:border-slate-900 group/btn shadow-sm hover:shadow-lg">
                                <MoreHorizontal className="h-5 w-5 transition-transform group-hover/btn:scale-110" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-64 rounded-2xl border border-slate-200 shadow-xl p-3 bg-white/98 backdrop-blur-2xl">
                              <DropdownMenuLabel className="text-[9px] font-black text-slate-400 uppercase tracking-wider px-3 py-2">{t('settings.users.selectNewRole')}</DropdownMenuLabel>
                              <DropdownMenuSeparator className="bg-slate-100 my-1.5 h-px rounded-full" />
                              <div className="grid gap-1">
                                {Object.entries(roleLabels).map(([role, label]) => {
                                  const Icon = roleIcons[role] || Users
                                  const isActive = currentRole === role
                                  const isOriginal = user.role === role
                                  return (
                                    <DropdownMenuItem 
                                      key={role}
                                      onClick={() => handleRoleSelect(user.id, role)}
                                      className={cn(
                                        "flex items-center gap-3 rounded-xl cursor-pointer transition-all py-2.5 px-3 text-sm font-bold",
                                        isActive 
                                          ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20" 
                                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                      )}
                                    >
                                      <div className={cn(
                                        "p-1.5 rounded-lg border transition-colors",
                                        isActive ? "bg-white/10 border-white/20" : "bg-slate-50 border-slate-100"
                                      )}>
                                        <Icon className={cn("h-4 w-4", isActive ? "text-white" : "text-slate-400")} />
                                      </div>
                                      <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                          <span>{label}</span>
                                          {isOriginal && !isActive && (
                                            <span className="text-[8px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded-md">{t('settings.users.current')}</span>
                                          )}
                                        </div>
                                        <span className={cn("text-[8px] font-black uppercase tracking-wider opacity-60", isActive ? "text-white" : "text-slate-400")}>
                                          {role === "admin" ? t('roles.permissions.full') : role === "manager" ? t('roles.permissions.management') : t('roles.permissions.view')}
                                        </span>
                                      </div>
                                      {isActive && <Check className="h-4 w-4 ml-auto text-white" />}
                                    </DropdownMenuItem>
                                  )
                                })}
                              </div>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ProfileForm({ user, toast, roleLabels, roleColors }: { user: any, toast: any, roleLabels: Record<string, string>, roleColors: Record<string, string> }) {
  const { t } = useTranslation()
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
      const profileData = new FormData()
      profileData.append("avatarUrl", result.url)
      await updateProfile(profileData)
      
      toast({
        title: t('settings.profile.photoUpdated'),
        description: t('settings.profile.photoUpdatedDesc'),
      })
    } else {
      toast({
        title: t('common.error'),
        description: result.error || t('settings.profile.photoUploadError'),
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
        title: t('settings.profile.updated'),
        description: t('settings.profile.updatedDesc'),
      })
    } else {
      toast({
        title: t('common.error'),
        description: result.error || t('settings.profile.updateError'),
        variant: "destructive",
      })
    }
    setIsLoading(false)
  }

  return (
    <Card className="border border-slate-200/60 shadow-lg bg-white rounded-2xl overflow-hidden ring-1 ring-black/[0.03]">
      <CardHeader className="p-0 bg-slate-900 relative overflow-hidden h-32 md:h-40">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-amber-600/20 mix-blend-overlay" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] -mr-32 -mt-32 rounded-full" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 blur-[60px] -ml-24 -mb-24 rounded-full" />
      </CardHeader>
      
      <div className="px-6 md:px-10 -mt-12 md:-mt-16 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-8">
          <div className="relative group self-start">
            <Avatar className="h-24 w-24 md:h-32 md:w-32 rounded-3xl border-4 border-white shadow-2xl ring-1 ring-black/5 overflow-hidden transition-transform duration-500 group-hover:scale-[1.02]">
              <AvatarImage src={avatarUrl} className="object-cover" />
              <AvatarFallback className="bg-slate-100 text-slate-900 font-black text-3xl">
                {user?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <button 
              onClick={handleAvatarClick}
              disabled={isUploading}
              className="absolute -bottom-2 -right-2 p-2.5 bg-slate-900 text-white rounded-xl shadow-xl hover:bg-blue-600 transition-all active:scale-90 group/btn border-2 border-white disabled:opacity-50"
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Camera className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
              )}
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*" 
            />
          </div>
          
          <div className="flex-1 pb-2">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <h3 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight leading-none">
                  {user?.full_name || t('settings.users.noName')}
                </h3>
                <div className={cn(
                  "px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider border",
                  roleColors[user?.role] || roleColors.client
                )}>
                  {roleLabels[user?.role] || t('roles.client')}
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                <span>{user?.email}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span className="text-[10px] uppercase tracking-widest text-slate-400">ID: {user?.id?.slice(0, 8)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit}>
        <CardContent className="p-6 md:p-10 space-y-8 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="space-y-3">
              <Label htmlFor="fullName" className="text-slate-900 text-[10px] font-black uppercase tracking-wider flex items-center gap-2">
                <div className="p-1.5 bg-blue-50 rounded-lg border border-blue-100">
                  <User className="h-3.5 w-3.5 text-blue-600" />
                </div>
                {t('settings.profile.fullName')}
              </Label>
              <Input 
                id="fullName" 
                name="fullName" 
                placeholder={t('settings.profile.fullNamePlaceholder')}
                defaultValue={user?.full_name || ""} 
                className="bg-slate-50 border-2 border-slate-200 focus:bg-white focus:border-slate-900 focus:ring-slate-900/5 rounded-xl h-11 px-4 text-sm font-bold transition-all shadow-sm placeholder:text-slate-400"
              />
              <p className="text-[11px] text-slate-500 font-bold leading-relaxed pl-1">
                {t('settings.profile.fullNameDesc')}
              </p>
            </div>
            <div className="space-y-3">
              <Label htmlFor="email" className="text-slate-900 text-[10px] font-black uppercase tracking-wider flex items-center gap-2">
                <div className="p-1.5 bg-slate-100 rounded-lg border border-slate-200">
                  <Globe className="h-3.5 w-3.5 text-slate-600" />
                </div>
                {t('settings.profile.email')}
              </Label>
              <div className="relative group">
                <Input 
                  id="email" 
                  value={user?.email} 
                  disabled 
                  className="bg-slate-100 border-2 border-slate-200 text-slate-500 cursor-not-allowed rounded-xl h-11 px-4 text-sm font-bold shadow-inner opacity-80"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
              </div>
              <p className="text-[11px] text-slate-500 font-bold leading-relaxed pl-1 flex items-center gap-1.5">
                <AlertCircle className="h-3 w-3 text-amber-600" />
                {t('settings.profile.emailNoChange')}
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4 text-slate-700 bg-slate-50 p-5 rounded-2xl border border-slate-100 max-w-xl">
              <div className="p-2 bg-amber-100 rounded-xl shrink-0 shadow-sm">
                <AlertCircle className="h-5 w-5 text-amber-700" />
              </div>
              <p className="text-xs font-bold leading-relaxed">
                {t('settings.profile.dataCorrectnessWarning')}
              </p>
            </div>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full md:w-auto min-w-[200px] h-11 bg-slate-900 hover:bg-black text-white rounded-xl text-sm font-black shadow-xl shadow-slate-900/10 transition-all active:scale-95 disabled:opacity-50 group"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('common.saving')}
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  {t('common.saveChanges')}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  )
}

function SecurityForm({ toast }: { toast: any }) {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const password = formData.get("password") as string
    const confirm = formData.get("confirmPassword") as string
    
    if (password !== confirm) {
      toast({
        title: t('common.error'),
        description: t('settings.security.passwordsDoNotMatch'),
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    const result = await updateProfile(formData)

    if (result.success) {
      toast({
        title: t('settings.security.passwordUpdated'),
        description: t('settings.security.passwordUpdatedDesc'),
      })
      ;(event.target as HTMLFormElement).reset()
    } else {
      toast({
        title: t('common.error'),
        description: result.error || t('settings.security.updateError'),
        variant: "destructive",
      })
    }
    setIsLoading(false)
  }

  return (
    <Card className="border border-slate-200/60 shadow-lg bg-white rounded-2xl overflow-hidden ring-1 ring-black/[0.03]">
      <CardHeader className="p-6 md:p-8 border-b border-slate-100 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[80px] -mr-32 -mt-32 rounded-full" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3 bg-slate-900 rounded-xl shadow-lg shadow-slate-900/20 ring-2 ring-slate-900/5">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{t('settings.security.title')}</CardTitle>
            <CardDescription className="text-slate-600 text-sm font-bold">{t('settings.security.description')}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="p-6 md:p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="space-y-3">
              <Label htmlFor="password" title={t('settings.security.newPassword')} className="text-slate-900 text-[10px] font-black uppercase tracking-wider flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
                {t('settings.security.newPassword')}
              </Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                required 
                minLength={6} 
                placeholder="••••••••"
                className="bg-slate-50 border-2 border-slate-200 focus:bg-white focus:border-slate-900 focus:ring-slate-900/5 rounded-xl h-11 px-4 text-sm font-bold transition-all shadow-sm"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="confirmPassword" title={t('settings.security.confirmPassword')} className="text-slate-900 text-[10px] font-black uppercase tracking-wider flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
                {t('settings.security.confirmPassword')}
              </Label>
              <Input 
                id="confirmPassword" 
                name="confirmPassword" 
                type="password" 
                required 
                minLength={6} 
                placeholder="••••••••"
                className="bg-slate-50 border-2 border-slate-200 focus:bg-white focus:border-slate-900 focus:ring-slate-900/5 rounded-xl h-11 px-4 text-sm font-bold transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="p-5 bg-slate-900 rounded-2xl text-white relative overflow-hidden group shadow-xl">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600 opacity-20 blur-[80px] -mr-24 -mt-24 group-hover:opacity-40 transition-opacity duration-700" />
            <div className="flex items-start gap-4 relative z-10">
              <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md border border-white/20 shadow-inner">
                <ShieldCheck className="h-5 w-5 text-blue-400" />
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-sm tracking-tight">{t('settings.security.tipTitle')}</h4>
                <p className="text-slate-400 text-xs font-medium leading-relaxed max-w-2xl">
                  {t('settings.security.tipDesc')}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full md:w-auto min-w-[200px] h-11 bg-slate-900 hover:bg-black text-white rounded-xl text-sm font-black shadow-xl shadow-slate-900/10 transition-all active:scale-95 disabled:opacity-50 group"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('common.updating')}
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  {t('settings.security.updateButton')}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  )
}

function LanguageForm({ user, toast }: { user: any, toast: any }) {
  const [isLoading, setIsLoading] = useState(false)
  const { setLanguage, t } = useTranslation()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const newLang = formData.get("language") as "ru" | "cn"
    const result = await updateProfile(formData)

    if (result.success) {
      setLanguage(newLang)
      toast({ 
        title: t('settings_status.success'),
        description: t('settings_status.success'),
      })
    } else {
      toast({
        title: t('settings_status.error'),
        description: result.error || t('settings_status.error'),
        variant: "destructive",
      })
    }
    setIsLoading(false)
  }

  return (
    <Card className="border border-slate-200/60 shadow-lg bg-white rounded-2xl overflow-hidden ring-1 ring-black/[0.03]">
      <CardHeader className="p-6 md:p-8 border-b border-slate-100 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[80px] -mr-32 -mt-32 rounded-full" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3 bg-slate-900 rounded-xl shadow-lg shadow-slate-900/20 ring-2 ring-slate-900/5">
            <Globe className="h-6 w-6 text-white" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{t('settings.language.title')}</CardTitle>
            <CardDescription className="text-slate-600 text-sm font-bold">{t('settings.language.description')}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="p-6 md:p-10 space-y-8">
          <div className="space-y-6 max-w-xl">
            <div className="space-y-3">
              <Label htmlFor="language" className="text-slate-900 text-[10px] font-black uppercase tracking-wider flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                {t('tabs.language')}
              </Label>
              <Select name="language" defaultValue={user?.preferred_language || "ru"}>
                <SelectTrigger className="bg-slate-50 border-2 border-slate-200 focus:bg-white focus:border-slate-900 focus:ring-slate-900/5 rounded-xl h-11 px-4 text-sm font-bold transition-all shadow-sm">
                  <SelectValue placeholder={t('settings.language.selectPlaceholder')} />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-2 border-slate-200 shadow-xl p-2 bg-white/98 backdrop-blur-2xl">
                  <SelectItem value="ru" className="rounded-xl focus:bg-slate-50 cursor-pointer py-3 px-4 transition-all">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl drop-shadow-sm">🇷🇺</span>
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900 text-sm tracking-tight">{t('settings.language.russian')}</span>
                        <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{t('settings.language.russian')}</span>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="cn" className="rounded-xl focus:bg-slate-50 cursor-pointer py-3 px-4 transition-all">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl drop-shadow-sm">🇨🇳</span>
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900 text-sm tracking-tight">{t('settings.language.chinese')}</span>
                        <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{t('settings.language.chinese')}</span>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100 relative overflow-hidden group shadow-sm">
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/5 blur-[80px] -mr-24 -mt-24" />
              <div className="flex gap-4 relative z-10">
                <div className="p-2 bg-white rounded-lg shadow-sm border border-blue-100 shrink-0 h-fit">
                  <Globe className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-xs text-blue-900 font-bold leading-relaxed">
                  {t('settings.language.instantApplyDesc')}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full md:w-auto min-w-[200px] h-11 bg-slate-900 hover:bg-black text-white rounded-xl text-sm font-black shadow-xl shadow-slate-900/10 transition-all active:scale-95 disabled:opacity-50 group"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('settings.language.applying')}
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  {t('settings.language.applyButton')}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  )
}

