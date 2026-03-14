"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { getUsers, updateUserRole } from "@/app/actions/users"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronDown, Loader2, Search, MoreHorizontal, ShieldCheck, UserCheck, Briefcase, Users, Mail, Calendar, UserCog, Filter, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

const roleLabels: Record<string, string> = {
  admin: "Администратор",
  manager: "Менеджер",
  partner: "Партнер",
  client: "Клиент",
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

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const fetchUsers = async () => {
    setIsLoading(true)
    const data = await getUsers()
    setUsers(data)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    // Optimistic update
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u))

    const result = await updateUserRole(userId, newRole)
    if (!result.success) {
      // Revert if failed
      fetchUsers()
      alert("Не удалось обновить роль")
    }
  }

  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 min-h-screen bg-slate-50/50">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 md:p-2.5 bg-white rounded-xl md:rounded-2xl shadow-sm border border-slate-100">
              <UserCog className="h-5 w-5 md:h-6 md:w-6 text-amber-500" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Управление пользователями</h2>
          </div>
          <p className="text-sm md:text-base text-slate-500 ml-10 md:ml-12">
            Контроль доступа и управление ролями участников системы Golden Russia.
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 md:gap-3"
        >
          <div className="relative group flex-1 md:flex-none">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
            <Input
              placeholder="Поиск..."
              className="pl-10 pr-4 w-full md:w-80 h-11 md:h-12 bg-white border-slate-200 rounded-xl md:rounded-2xl shadow-sm focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm md:text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-11 w-11 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-white border-slate-200 shadow-sm p-0 flex-shrink-0">
            <Filter className="h-4 w-4 md:h-5 md:w-5 text-slate-500" />
          </Button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="border-slate-200 shadow-xl shadow-slate-200/50 rounded-2xl md:rounded-3xl overflow-hidden bg-white border-0">
          <CardHeader className="border-b border-slate-100 bg-white p-5 md:p-8">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg md:text-xl font-bold text-slate-900">Список участников</CardTitle>
                <CardDescription className="mt-1 flex items-center gap-2">
                  <span className="flex items-center gap-1.5 px-2 py-0.5 md:px-2.5 md:py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-wider">
                    <Users className="h-3 w-3" />
                    Всего: {users.length}
                  </span>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-12 md:p-24 text-slate-400">
                <div className="relative">
                  <Loader2 className="h-10 w-10 md:h-12 md:w-12 animate-spin text-amber-500" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-3 w-3 md:h-4 md:w-4 bg-white rounded-full" />
                  </div>
                </div>
                <p className="mt-4 text-sm md:text-base font-medium animate-pulse">Загрузка базы данных...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow className="hover:bg-transparent border-slate-100">
                      <TableHead className="pl-5 md:pl-8 py-4 md:py-5 text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em] md:tracking-[0.2em]">Пользователь</TableHead>
                      <TableHead className="hidden md:table-cell py-4 md:py-5 text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">Email</TableHead>
                      <TableHead className="py-4 md:py-5 text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em] md:tracking-[0.2em]">Роль</TableHead>
                      <TableHead className="hidden lg:table-cell py-4 md:py-5 text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">Регистрация</TableHead>
                      <TableHead className="pr-5 md:pr-8 py-4 md:py-5 text-right text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em] md:tracking-[0.2em]">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence mode="popLayout">
                      {filteredUsers.length === 0 ? (
                         <TableRow>
                          <TableCell colSpan={5} className="h-32 md:h-40 text-center text-slate-400 bg-slate-50/30">
                            <div className="flex flex-col items-center justify-center gap-2">
                              <Search className="h-8 w-8 md:h-10 md:w-10 opacity-10 mb-2" />
                              <p className="text-xs md:text-sm font-medium">Пользователи не найдены</p>
                              <Button variant="link" onClick={() => setSearchQuery("")} className="text-amber-500 p-0 h-auto text-xs md:text-sm">Сбросить поиск</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUsers.map((user, index) => {
                          const RoleIcon = roleIcons[user.role] || Users
                          return (
                            <motion.tr 
                              key={user.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              className="group hover:bg-slate-50/50 border-slate-100 transition-colors"
                            >
                              <TableCell className="pl-5 md:pl-8 py-3 md:py-4">
                                <div className="flex items-center gap-3 md:gap-4">
                                  <div className="relative group-hover:scale-105 transition-transform duration-300">
                                    <Avatar className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl ring-2 md:ring-4 ring-white shadow-md">
                                      <AvatarImage src={user.avatar_url} />
                                      <AvatarFallback className="bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 font-bold text-base md:text-lg">
                                        {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="absolute -bottom-0.5 -right-0.5 md:-bottom-1 md:-right-1 w-3 h-3 md:w-4 md:h-4 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
                                  </div>
                                  <div className="flex flex-col gap-0.5 min-w-0">
                                    <span className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors truncate text-sm md:text-base">{user.full_name || "Без имени"}</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest md:hidden truncate max-w-[120px]">{user.email}</span>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="hidden md:table-cell py-3 md:py-4">
                                <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
                                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                                  {user.email}
                                </div>
                              </TableCell>
                              <TableCell className="py-3 md:py-4">
                                <div className={cn(
                                  "inline-flex items-center gap-1.5 md:gap-2 rounded-lg md:rounded-xl px-2 py-1 md:px-3 md:py-1.5 text-[10px] md:text-xs font-bold border transition-all duration-300",
                                  roleColors[user.role] || "bg-gray-50 text-gray-700 border-gray-200"
                                )}>
                                  <RoleIcon className="h-3 w-3 md:h-3.5 md:w-3.5" />
                                  <span className="uppercase tracking-wider hidden sm:inline">{roleLabels[user.role] || user.role}</span>
                                </div>
                              </TableCell>
                              <TableCell className="hidden lg:table-cell py-3 md:py-4">
                                <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                                  <Calendar className="h-3.5 w-3.5 text-slate-300" />
                                  {new Date(user.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </div>
                              </TableCell>
                              <TableCell className="pr-5 md:pr-8 py-3 md:py-4 text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 md:h-10 md:w-10 rounded-lg md:rounded-xl hover:bg-slate-100 text-slate-400 transition-all">
                                      <MoreHorizontal className="h-4 w-4 md:h-5 md:w-5" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-60 md:w-64 p-1.5 md:p-2 bg-white rounded-xl md:rounded-2xl shadow-2xl border-slate-100">
                                    <DropdownMenuLabel className="px-3 py-2">
                                      <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Смена привилегий</p>
                                      <p className="text-xs md:text-sm font-semibold truncate text-slate-900">{user.full_name}</p>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-slate-50" />
                                    <div className="grid gap-1 py-1">
                                      {Object.entries(roleLabels).map(([role, label]) => {
                                        const Icon = roleIcons[role] || Users
                                        return (
                                          <DropdownMenuItem
                                            key={role}
                                            onClick={() => handleRoleUpdate(user.id, role)}
                                            disabled={user.role === role}
                                            className={cn(
                                              "px-3 py-2 md:py-2.5 rounded-lg md:rounded-xl cursor-pointer group transition-all",
                                              user.role === role ? "bg-slate-50 text-slate-400" : "focus:bg-amber-500 focus:text-white"
                                            )}
                                          >
                                            <div className="flex items-center justify-between w-full">
                                              <div className="flex items-center gap-2 md:gap-3">
                                                <div className={cn(
                                                  "p-1.5 rounded-lg transition-colors",
                                                  user.role === role ? "bg-slate-200" : "bg-slate-100 group-focus:bg-amber-400"
                                                )}>
                                                  <Icon className="h-3 w-3 md:h-3.5 md:w-3.5" />
                                                </div>
                                                <span className="font-semibold text-xs md:text-sm">{label}</span>
                                              </div>
                                              {user.role === role && (
                                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                              )}
                                            </div>
                                          </DropdownMenuItem>
                                        )
                                      })}
                                    </div>
                                    <DropdownMenuSeparator className="bg-slate-50" />
                                    <DropdownMenuItem className="px-3 py-2 md:py-2.5 rounded-lg md:rounded-xl cursor-pointer text-red-500 focus:bg-red-50 focus:text-red-600">
                                      <div className="flex items-center gap-2 md:gap-3 font-semibold text-xs md:text-sm">
                                        <div className="p-1.5 rounded-lg bg-red-50 group-focus:bg-red-100">
                                          <Trash2 className="h-3 w-3 md:h-3.5 md:w-3.5" />
                                        </div>
                                        Удалить пользователя
                                      </div>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </motion.tr>
                          )
                        })
                      )}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
