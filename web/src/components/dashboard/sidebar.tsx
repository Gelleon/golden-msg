/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { LogOut, Plus, Settings, User, MessageSquare, Users, Search, Building2, ChevronRight, ChevronDown, Hash, Edit, Trash2, Info, UserPlus } from "lucide-react"
import { logout } from "@/app/actions/auth"
import { getRooms, createRoom, getDMs, searchUsers, startDM, deleteRoom, addParticipant } from "@/app/actions/room"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { EditRoomDialog } from "./edit-room-dialog"
import { useTranslation } from "@/lib/language-context"
import { ErrorBoundary } from "@/components/error-boundary"
import { RoomInfo } from "@/components/chat/room-info"

interface SidebarProps {
  user: any
  profile: any
  className?: string
  onClose?: () => void
}

export function Sidebar({ user, profile, className, onClose }: SidebarProps) {
  const router = useRouter()
  const { t } = useTranslation()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [rooms, setRooms] = useState<any[]>([])
  const [dms, setDms] = useState<any[]>([])
  const [newRoomName, setNewRoomName] = useState("")
  const [isRoomDialogOpen, setIsRoomDialogOpen] = useState(false)
  const [isDMDialogOpen, setIsDMDialogOpen] = useState(false)
  const [isAddUserToDMDialogOpen, setIsAddUserToDMDialogOpen] = useState(false)
  const [targetDMId, setTargetDMId] = useState<string | null>(null)
  const [dmSearchQuery, setDmSearchQuery] = useState("")
  const [dmSearchResults, setDmSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [editingRoom, setEditingRoom] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)
  const [roomInfoDialogId, setRoomInfoDialogId] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const roleLabels: Record<string, string> = {
    admin: t('roles.admin'),
    manager: t('roles.manager'),
    partner: t('roles.partner'),
    client: t('roles.client'),
  }

  const isUserOnline = (lastActiveAt?: string | null) => {
    if (!lastActiveAt) return false
    return (Date.now() - new Date(lastActiveAt).getTime() <= 2 * 60 * 1000)
  }

  const fetchRoomsAndDMs = async () => {
    try {
      const [fetchedRooms, fetchedDMs] = await Promise.all([
        getRooms(),
        getDMs()
      ])
      
      // Sort rooms by created_at or name if needed, or just set them
      setRooms(fetchedRooms)
      setDms(fetchedDMs)
    } catch (error) {
      console.error("Error fetching rooms/DMs:", error)
    }
  }

  useEffect(() => {
    fetchRoomsAndDMs()
    
    // Polling every 30 seconds instead of 5 to reduce server load
    const interval = setInterval(fetchRoomsAndDMs, 30000)
    return () => clearInterval(interval)
  }, [user.id])

  const handleSignOut = async () => {
    await logout()
  }

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) return

    try {
      const result = await createRoom(newRoomName)

      if (result.success && result.room) {
        setNewRoomName("")
        setIsRoomDialogOpen(false)
        fetchRoomsAndDMs()
        router.push(`/dashboard/rooms/${result.room.id}`)
        onClose?.()
      } else {
        console.error("Error creating room:", result.error, result.details)
        alert((result.error || "Failed to create room") + (result.details ? `: ${result.details}` : ""))
      }
    } catch (error: any) {
      console.error("Failed to create room:", error)
      alert("Произошла ошибка при создании комнаты. Пожалуйста, попробуйте позже.")
    }
  }

  const performSearch = async (query: string) => {
    setIsSearching(true);
    try {
      const users = await searchUsers(query);
      setDmSearchResults(users || []);
    } catch (error) {
      console.error("Error searching users:", error);
      setDmSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleManualSearch = () => {
    performSearch(dmSearchQuery);
  };

  useEffect(() => {
    if (!isDMDialogOpen && !isAddUserToDMDialogOpen) {
      setDmSearchQuery("");
      setDmSearchResults([]);
      setHasSearched(false);
      return;
    }

    let isMounted = true;
    
    // Set searching to true immediately if we haven't searched yet to prevent "No users found" flash
    if (!hasSearched && dmSearchResults.length === 0) {
      setIsSearching(true);
    }
    
    const timeoutId = setTimeout(async () => {
      if (!isMounted) return;
      setIsSearching(true);
      try {
        const users = await searchUsers(dmSearchQuery);
        if (isMounted) {
          setDmSearchResults(users || []);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error searching users:", error);
          setDmSearchResults([]);
        }
      } finally {
        if (isMounted) {
          setIsSearching(false);
          setHasSearched(true);
        }
      }
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDMDialogOpen, isAddUserToDMDialogOpen, dmSearchQuery]);

  const handleStartDM = async (otherUserId: string) => {
    if (!selectedRoomId) {
      alert(t('sidebar.selectRoomForDM') || "Пожалуйста, выберите комнату")
      return
    }
    
    try {
      const result = await startDM(otherUserId, selectedRoomId)

      if (result.success && result.room) {
        setIsDMDialogOpen(false)
        fetchRoomsAndDMs()
        router.push(`/dashboard/rooms/${result.room.id}`)
        onClose?.()
      } else {
        console.error("Error creating DM:", result.error, result.details)
        alert(result.error + (result.details ? `: ${result.details}` : ""))
      }
    } catch (error: any) {
      console.error("Failed to start DM:", error)
      alert("Ошибка при создании чата. Пожалуйста, попробуйте позже.")
    }
  }

  const handleAddUserToDM = async (userId: string) => {
    if (!targetDMId) return

    try {
      const result = await addParticipant(targetDMId, userId)
      
      if (result.success) {
        setIsAddUserToDMDialogOpen(false)
        setTargetDMId(null)
        fetchRoomsAndDMs()
        alert("Пользователь успешно добавлен")
      } else {
        alert(result.error || "Ошибка при добавлении пользователя")
      }
    } catch (error) {
      console.error("Error adding user to DM:", error)
      alert("Ошибка при добавлении пользователя")
    }
  }

  const handleEditRoom = (room: any) => {
    setEditingRoom(room)
    setIsEditDialogOpen(true)
  }

  const handleDeleteRoom = async (roomId: string) => {
    if (!confirm(t('sidebar.confirmDeleteRoom') || "Are you sure you want to delete this room?")) return

    const result = await deleteRoom(roomId)

    if (result.success) {
      fetchRoomsAndDMs()
      if (pathname === `/dashboard/rooms/${roomId}`) {
        router.push("/dashboard")
      }
    } else {
      alert(result.error || "Failed to delete room")
    }
  }

  const handleDeleteDM = async (dmId: string) => {
    const result = await deleteRoom(dmId)

    if (result.success) {
      setIsDeleteDialogOpen(false)
      setDeletingId(null)
      fetchRoomsAndDMs()
      if (pathname === `/dashboard/rooms/${dmId}`) {
        router.push("/dashboard")
      }
    } else {
      alert(result.error || "Failed to delete chat")
    }
  }

  const handleDeleteClick = (dmId: string) => {
    setDeletingId(dmId)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (deletingId) {
      handleDeleteDM(deletingId)
    }
  }

  const canCreateRoom = ["admin", "manager"].includes(profile?.role)
  const canEditRoom = ["admin", "manager"].includes(profile?.role)
  const canUseDM = profile?.role !== "client"

  if (!mounted) {
    return (
      <div className={cn("w-72 bg-[#0F172A] text-slate-100 flex flex-col h-full border-r border-white/5 shadow-2xl relative z-10", className)}>
        <div className="p-6 pb-4 flex items-center gap-3">
          <div className="p-2.5 bg-amber-500 rounded-xl">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <h1 className="font-bold text-lg tracking-tight text-white leading-none">Golden Russia</h1>
        </div>
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={cn("w-72 bg-[#0F172A] text-slate-100 flex flex-col h-full border-r border-white/5 shadow-2xl relative z-10", className)}
    >
      {/* Glow Effect */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
        className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-600/10 to-transparent pointer-events-none" 
      />

      {/* Header */}
      <motion.div 
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="p-6 pb-4 flex items-center gap-3 relative"
      >
        <div className="relative">
          <motion.div 
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="p-2.5 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl shadow-lg shadow-amber-500/20 ring-1 ring-white/20"
          >
            <Building2 className="h-5 w-5 text-white" />
          </motion.div>
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-[#0F172A] rounded-full shadow-sm" 
          />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight text-white leading-none">Golden Russia</h1>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[10px] text-amber-500 font-bold uppercase tracking-[0.2em]">Business</span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span className="text-[10px] text-slate-400 font-medium">Messenger</span>
          </div>
        </div>
      </motion.div>

      <ErrorBoundary fallback={<div className="p-4 text-center text-red-400 text-sm">Failed to load sidebar content. Please refresh.</div>}>
        <ScrollArea className="flex-1 px-4 py-4">
          <div className="space-y-8">
            {/* Group Rooms */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-3 px-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  {t('common.rooms')}
                </span>
                <span className="px-1.5 py-0.5 bg-slate-800 text-[10px] text-slate-400 rounded-md font-bold">
                  {rooms.length}
                </span>
              </div>
              {canCreateRoom && (
                <Dialog open={isRoomDialogOpen} onOpenChange={setIsRoomDialogOpen}>
                  <DialogTrigger asChild>
                    <motion.div whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}>
                      <Button variant="ghost" size="icon" className="h-6 w-6 rounded-lg bg-slate-800/50 hover:bg-amber-500 hover:text-white text-slate-400 transition-all duration-300">
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </motion.div>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] bg-[#0F172A] border-white/10 text-white overflow-hidden rounded-3xl">
                    <motion.div 
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-amber-600 origin-left" 
                    />
                    <DialogHeader className="pt-4">
                      <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <Plus className="h-5 w-5 text-amber-500" />
                        {t('sidebar.createRoom')}
                      </DialogTitle>
                      <DialogDescription className="text-slate-400">
                        {t('sidebar.createRoomDesc')}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-semibold text-slate-300">{t('sidebar.roomName')}</Label>
                        <div className="relative">
                          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                          <Input
                            id="name"
                            value={newRoomName}
                            onChange={(e) => setNewRoomName(e.target.value)}
                            placeholder={t('sidebar.roomNamePlaceholder')}
                            className="pl-10 bg-white/5 border-white/10 focus:border-amber-500 focus:ring-amber-500/20 text-white h-11 rounded-xl"
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        onClick={handleCreateRoom} 
                        className="w-full h-11 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold shadow-lg shadow-amber-500/20 border-0 transition-all duration-300 active:scale-[0.98]"
                      >
                        {t('sidebar.createRoom')}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
            <div className="space-y-1">
              <AnimatePresence mode="popLayout" initial={false}>
                {rooms.map((room, index) => (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <ContextMenu>
                      <ContextMenuTrigger asChild className="sidebar-item-trigger">
                        <Link
                          href={`/dashboard/rooms/${room.id}`}
                          className="block"
                          onClick={onClose}
                        >
                          <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
                            <div
                              className={cn(
                                buttonVariants({ variant: "ghost" }),
                                "w-full justify-start font-medium transition-all duration-300 group rounded-xl px-3 h-auto min-h-[2.5rem] py-2 relative cursor-pointer",
                                pathname === `/dashboard/rooms/${room.id}` 
                                  ? "bg-white/10 text-white shadow-sm ring-1 ring-white/10" 
                                  : "text-slate-400 hover:text-white hover:bg-white/5"
                              )}
                            >
                              <div className={cn(
                                "w-2 h-2 rounded-full mr-3 mt-1.5 transition-all duration-300 shrink-0",
                                pathname === `/dashboard/rooms/${room.id}` ? "bg-amber-500 scale-125" : "bg-slate-700 group-hover:bg-slate-500"
                              )} />
                              <div className="flex flex-col min-w-0 flex-1">
                                <div className="flex items-center">
                                  <span className="truncate flex-1 text-left">{room.name}</span>
                                  {room.unreadCount > 0 && pathname !== `/dashboard/rooms/${room.id}` && (
                                    <span className="flex h-5 min-w-[20px] shrink-0 items-center justify-center rounded-full bg-amber-500 px-1.5 text-[10px] font-bold text-white shadow-lg shadow-amber-500/20 ml-2">
                                      {room.unreadCount}
                                    </span>
                                  )}
                                  {pathname === `/dashboard/rooms/${room.id}` && (
                                    <motion.div 
                                      layoutId="activeRoomGlow"
                                      className="w-1.5 h-1.5 shrink-0 rounded-full bg-amber-500 animate-pulse ml-2" 
                                    />
                                  )}
                                </div>
                                {room.description && (
                                  <span className="text-[10px] text-slate-500 mt-0.5 line-clamp-1 text-left font-normal pr-2">
                                    {room.description}
                                  </span>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        </Link>
                      </ContextMenuTrigger>
                      <ContextMenuContent className="w-56 bg-[#1E293B] border-white/10 text-slate-200">
                        <ContextMenuItem 
                          onClick={() => setRoomInfoDialogId(room.id)}
                          className="hover:bg-white/10 focus:bg-white/10 cursor-pointer"
                        >
                          <Info className="mr-2 h-4 w-4 text-blue-400" />
                          <span>{t('roomInfo.title') || "Информация о комнате"}</span>
                        </ContextMenuItem>
                        {canEditRoom && (
                          <>
                            <ContextMenuItem 
                              onClick={() => handleEditRoom(room)}
                              className="hover:bg-amber-500 hover:text-white focus:bg-amber-500 focus:text-white cursor-pointer"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              <span>{t('sidebar.editRoom')}</span>
                            </ContextMenuItem>
                            {profile?.role === "admin" && (
                              <ContextMenuItem 
                                onClick={() => handleDeleteRoom(room.id)}
                                className="hover:bg-red-500 hover:text-white focus:bg-red-500 focus:text-white cursor-pointer text-red-400"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>{t('sidebar.deleteRoom')}</span>
                              </ContextMenuItem>
                            )}
                          </>
                        )}
                      </ContextMenuContent>
                    </ContextMenu>
                  </motion.div>
                ))}
              </AnimatePresence>
              {rooms.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-slate-500 px-4 py-3 bg-white/5 rounded-xl border border-white/5 italic text-center"
                >
                  {t('sidebar.noRooms')}
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Direct Messages */}
          {canUseDM && (
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center justify-between mb-3 px-2">
                <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  {t('common.directMessages')}
                </span>
                <span className="px-1.5 py-0.5 bg-slate-800 text-[10px] text-slate-400 rounded-md font-bold">
                    {selectedRoomId ? dms.filter(dm => dm.room_id === selectedRoomId).length : dms.length}
                  </span>
                </div>
                <Dialog open={isDMDialogOpen} onOpenChange={setIsDMDialogOpen}>
                  <DialogTrigger asChild>
                    <motion.div whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}>
                      <Button variant="ghost" size="icon" className="h-6 w-6 rounded-lg bg-slate-800/50 hover:bg-amber-500 hover:text-white text-slate-400 transition-all duration-300">
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </motion.div>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] bg-[#0F172A] border-white/10 text-white overflow-hidden rounded-3xl">
                    <motion.div 
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-amber-600 origin-left" 
                    />
                    <DialogHeader className="pt-4">
                      <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-amber-500" />
                        {t('sidebar.newDM')}
                      </DialogTitle>
                      <DialogDescription className="text-slate-400">
                        {t('sidebar.newDMDesc')}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-slate-400 text-sm">{t('sidebar.selectRoomForDM') || "Выберите комнату"}</Label>
                          {selectedRoomId && (
                            <span className="text-[10px] text-slate-500">
                              {dms.filter(dm => dm.room_id === selectedRoomId).length} {t('sidebar.dmCount') || "DM"}
                            </span>
                          )}
                        </div>
                        <div className="relative">
                          <select
                            value={selectedRoomId || ""}
                            onChange={(e) => setSelectedRoomId(e.target.value || null)}
                            className="w-full h-11 px-3 pr-10 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 appearance-none cursor-pointer transition-all"
                          >
                            <option value="" className="bg-[#0F172A]">{t('sidebar.noRoomSelected') || "Без комнаты"}</option>
                            {rooms.map((room) => (
                              <option key={room.id} value={room.id} className="bg-[#0F172A]">
                                {room.name || t('sidebar.unnamedRoom')}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                          <Input
                            placeholder={t('sidebar.searchPlaceholder')}
                            value={dmSearchQuery}
                            onChange={(e) => setDmSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleManualSearch()}
                            className="pl-10 bg-white/5 border-white/10 focus:border-amber-500 focus:ring-amber-500/20 text-white h-11 rounded-xl"
                          />
                        </div>
                        <Button 
                          onClick={handleManualSearch} 
                          disabled={isSearching}
                          className="h-11 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border-white/10"
                        >
                          {isSearching ? <span className="animate-spin mr-2">◌</span> : <Search className="h-4 w-4" />}
                          {t('sidebar.find')}
                        </Button>
                      </div>
                      <ScrollArea className="h-[250px] rounded-xl border border-white/5 bg-white/5 p-2">
                        <div className="space-y-1">
                          <AnimatePresence>
                              {dmSearchResults.map((u, index) => (
                                <motion.div
                                  key={u.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                >
                                  <Button
                                    variant="ghost"
                                    className="w-full justify-start h-auto py-3 px-3 hover:bg-white/5 group rounded-xl transition-all duration-300"
                                    onClick={() => handleStartDM(u.id)}
                                  >
                                    <div className="relative">
                                      <Avatar className="h-10 w-10 mr-3 ring-2 ring-white/5 group-hover:ring-amber-500/30 transition-all">
                                        <AvatarImage src={u.avatar_url} />
                                        <AvatarFallback className="bg-gradient-to-br from-amber-500/20 to-amber-600/20 text-amber-500 font-bold">
                                          {u.full_name?.charAt(0) || u.email?.charAt(0) || "?"}
                                        </AvatarFallback>
                                      </Avatar>
                                      {isUserOnline(u.lastActiveAt) && (
                                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#1E293B] rounded-full" />
                                      )}
                                    </div>
                                    <div className="flex flex-col items-start text-sm overflow-hidden">
                                      <span className="font-semibold text-slate-200 group-hover:text-white transition-colors truncate w-full text-left">{u.full_name || u.email || "Unknown User"}</span>
                                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5 flex items-center gap-1 w-full flex-wrap">
                                        <span>{roleLabels[u.role] || u.role}</span>
                                        {u.sharedRoomName && (
                                          <>
                                            <span className="w-1 h-1 rounded-full bg-slate-500 shrink-0" />
                                            <span className="truncate normal-case font-medium text-slate-400">{t('room.sharedRooms')}: {u.sharedRoomName}</span>
                                          </>
                                        )}
                                      </span>
                                    </div>
                                    <ChevronRight className="h-4 w-4 ml-auto text-slate-600 group-hover:text-amber-500 transition-all group-hover:translate-x-1 shrink-0" />
                                  </Button>
                                </motion.div>
                              ))}
                              {dmSearchResults.length === 0 && !isSearching && hasSearched && (
                                <div className="p-4 text-center text-sm text-slate-400">
                                  {t('sidebar.noUsersFound')}
                                </div>
                              )}
                          </AnimatePresence>
                        </div>
                      </ScrollArea>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Add User to DM Dialog */}
                <Dialog open={isAddUserToDMDialogOpen} onOpenChange={setIsAddUserToDMDialogOpen}>
                  <DialogContent className="bg-[#1E293B] text-white border-white/10 sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>{t('sidebar.addUser') || "Добавить пользователя"}</DialogTitle>
                      <DialogDescription className="text-slate-400">
                        {t('sidebar.searchUserToAdd') || "Найдите пользователя, чтобы добавить его в текущую комнату"}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          placeholder={t('sidebar.searchUsers') || "Поиск пользователей..."}
                          className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-amber-500/50"
                          value={dmSearchQuery}
                          onChange={(e) => setDmSearchQuery(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleManualSearch()}
                        />
                      </div>
                      <ScrollArea className="h-[300px] rounded-xl border border-white/5 bg-white/5 p-2">
                        {isSearching ? (
                          <div className="p-4 text-center text-sm text-slate-400 flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                            {t('common.loading')}
                          </div>
                        ) : dmSearchResults.length > 0 ? (
                          <div className="space-y-1">
                            {dmSearchResults.map((u) => (
                              <div
                                key={u.id}
                                className="flex items-center justify-between p-2 rounded-lg hover:bg-white/10 transition-colors"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <Avatar className="h-8 w-8 ring-1 ring-white/10">
                                    <AvatarImage src={u.avatar_url} />
                                    <AvatarFallback className="bg-slate-800 text-xs text-slate-400">
                                      {u.full_name?.charAt(0) || "?"}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-medium text-slate-200 truncate">{u.full_name || t('common.unknown')}</span>
                                    <span className="text-xs text-slate-500 truncate flex flex-wrap items-center gap-1 w-full">
                                      <span>{u.email}</span>
                                      <span className="w-1 h-1 rounded-full bg-slate-600 shrink-0" />
                                      <span>{roleLabels[u.role] || u.role}</span>
                                      {u.sharedRoomName && (
                                        <>
                                          <span className="w-1 h-1 rounded-full bg-slate-500 shrink-0" />
                                          <span className="truncate normal-case font-medium text-slate-400">{t('room.sharedRooms')}: {u.sharedRoomName}</span>
                                        </>
                                      )}
                                    </span>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleAddUserToDM(u.id)}
                                  className="text-amber-500 hover:text-amber-400 hover:bg-amber-500/10 h-8 px-2 gap-2"
                                  title={t('sidebar.addUser')}
                                >
                                  <span className="text-xs font-medium">{t('sidebar.add')}</span>
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : hasSearched ? (
                          <div className="p-4 text-center text-sm text-slate-400">
                            {t('sidebar.noUsersFound')}
                          </div>
                        ) : null}
                      </ScrollArea>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="space-y-1">
                <AnimatePresence mode="popLayout" initial={false}>
                  {dms.map((dm, index) => (
                    <motion.div
                      key={dm.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <ContextMenu>
                        <ContextMenuTrigger asChild className="sidebar-item-trigger">
                          <Link
                            href={`/dashboard/rooms/${dm.id}`}
                            className="block"
                            onClick={onClose}
                          >
                            <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
                            <div
                              className={cn(
                                buttonVariants({ variant: "ghost" }),
                                "w-full justify-start font-medium transition-all duration-300 group rounded-xl px-3 h-12 relative cursor-pointer",
                                pathname === `/dashboard/rooms/${dm.id}` 
                                  ? "bg-white/10 text-white shadow-sm ring-1 ring-white/10" 
                                  : "text-slate-400 hover:text-white hover:bg-white/5"
                              )}
                            >
                              <div className="relative">
                                <Avatar className={cn(
                                  "h-8 w-8 mr-3 transition-all duration-300",
                                  pathname === `/dashboard/rooms/${dm.id}` ? "ring-2 ring-amber-500/50 shadow-lg shadow-amber-500/10" : "ring-1 ring-white/10 group-hover:ring-white/20"
                                )}>
                                  <AvatarImage src={dm.otherUser?.avatar_url} />
                                  <AvatarFallback className="bg-slate-800 text-xs text-slate-400 font-bold">
                                    {dm.otherUser?.full_name?.charAt(0) || "?"}
                                  </AvatarFallback>
                                </Avatar>
                                {isUserOnline(dm.otherUserLastActiveAt) && (
                                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0F172A] rounded-full" />
                                )}
                              </div>
                              <div className="flex flex-col items-start min-w-0 flex-1">
                                <span className="truncate w-full text-left">{dm.otherUser?.full_name || t('common.unknown')}</span>
                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-none mt-1 flex items-center gap-1 w-full">
                                  <span>{roleLabels[dm.otherUser?.role] || dm.otherUser?.role}</span>
                                  {dm.parentRoomName && (
                                    <>
                                      <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                                      <span className="truncate normal-case font-medium text-slate-400">{dm.parentRoomName}</span>
                                    </>
                                  )}
                                  {!dm.parentRoomName && dm.sharedRoomName && (
                                    <>
                                      <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                                      <span className="truncate normal-case font-medium text-slate-400">{t('room.sharedRooms')}: {dm.sharedRoomName}</span>
                                    </>
                                  )}
                                </span>
                              </div>
                              {dm.unreadCount > 0 && pathname !== `/dashboard/rooms/${dm.id}` && (
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-amber-500 px-1.5 text-[10px] font-bold text-white shadow-lg shadow-amber-500/20">
                                  {dm.unreadCount}
                                </span>
                              )}
                              {pathname === `/dashboard/rooms/${dm.id}` && (
                                <motion.div 
                                  layoutId="activeDMGlow"
                                  className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse ml-2" 
                                />
                              )}
                            </div>
                          </motion.div>
                          </Link>
                        </ContextMenuTrigger>
                        <ContextMenuContent className="w-56 bg-[#1E293B] border-white/10 text-slate-200">
                          <ContextMenuItem 
                            onClick={() => setRoomInfoDialogId(dm.id)}
                            className="hover:bg-white/10 focus:bg-white/10 cursor-pointer"
                          >
                            <Info className="mr-2 h-4 w-4 text-blue-400" />
                            <span>{t('roomInfo.title') || "Информация о комнате"}</span>
                          </ContextMenuItem>
                          {(profile?.role === "admin" || profile?.role === "manager") && (
                            <>
                              <ContextMenuItem 
                                onClick={() => {
                                  setTargetDMId(dm.id)
                                  setIsAddUserToDMDialogOpen(true)
                                }}
                                className="hover:bg-white/10 focus:bg-white/10 cursor-pointer"
                              >
                                <UserPlus className="mr-2 h-4 w-4 text-amber-500" />
                                <span>{t('sidebar.addUser') || "Добавить пользователя"}</span>
                              </ContextMenuItem>
                              <ContextMenuItem 
                                onClick={() => handleDeleteClick(dm.id)}
                                className="hover:bg-red-500 hover:text-white focus:bg-red-500 focus:text-white cursor-pointer text-red-400"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>{t('sidebar.deleteChat') || "Удалить чат"}</span>
                              </ContextMenuItem>
                            </>
                          )}
                        </ContextMenuContent>
                      </ContextMenu>
                    </motion.div>
                  ))}
                </AnimatePresence>
            {dms.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-slate-500 px-4 py-3 bg-white/5 rounded-xl border border-white/5 italic text-center"
              >
                {t('sidebar.noActiveDMs')}
              </motion.div>
            )}
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>
      </ErrorBoundary>

      {/* User Footer */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="p-4 bg-[#0F172A] border-t border-white/5 relative"
      >
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-blue-600/5 to-transparent pointer-events-none" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button variant="ghost" className="w-full justify-start px-2 hover:bg-white/5 text-slate-300 h-auto py-3 rounded-xl transition-all group border border-transparent hover:border-white/5">
                <div className="relative">
                  <Avatar className="h-10 w-10 mr-3 ring-2 ring-amber-500/20 group-hover:ring-amber-500/40 transition-all shadow-lg">
                    <AvatarImage src={profile?.avatar_url} />
                    <AvatarFallback className="bg-gradient-to-br from-slate-800 to-slate-900 text-amber-500 font-bold">
                      {profile?.full_name?.charAt(0) || user.email?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex flex-col items-start text-xs truncate flex-1 overflow-hidden">
                  <span className="font-bold text-white truncate w-full text-left group-hover:text-amber-400 transition-colors">
                    {profile?.full_name || t('common.user')}
                  </span>
                  <span className="text-slate-500 font-bold uppercase tracking-widest text-[9px] mt-1 flex items-center gap-1.5">
                    <span className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      profile?.role === 'admin' ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" : "bg-slate-600"
                    )} />
                    {roleLabels[profile?.role] || profile?.role}
                  </span>
                </div>
                <Settings className="h-4 w-4 ml-2 text-slate-600 group-hover:text-slate-400 transition-colors" />
              </Button>
            </motion.div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 bg-[#0F172A] border-white/10 text-white p-2 rounded-2xl shadow-2xl" align="end" side="top" sideOffset={10}>
            <DropdownMenuLabel className="px-3 py-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{t('common.account')}</p>
              <p className="text-sm font-semibold truncate">{user.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/5" />
            <Link href="/dashboard/settings?tab=profile">
              <DropdownMenuItem className="px-3 py-2.5 rounded-xl focus:bg-white/10 focus:text-white cursor-pointer group transition-all">
                <User className="mr-3 h-4 w-4 text-slate-400 group-hover:text-amber-500" />
                <span className="font-medium">{t('tabs.profile')}</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem 
              onClick={handleSignOut} 
              className="px-3 py-2.5 rounded-xl focus:bg-red-500/10 focus:text-red-500 text-red-400 cursor-pointer group transition-all"
            >
              <LogOut className="mr-3 h-4 w-4 text-red-400/70 group-hover:text-red-500" />
              <span className="font-medium">{t('sidebar.logout')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>

      {editingRoom && (
        <EditRoomDialog
          room={editingRoom}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSuccess={fetchRoomsAndDMs}
        />
      )}

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-[#1E293B] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>{t('sidebar.confirmDeleteChat') || "Удалить чат?"}</DialogTitle>
            <DialogDescription className="text-slate-400">
              {t('sidebar.confirmDeleteChatDesc') || "Это действие нельзя отменить."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="text-slate-300 hover:bg-white/10"
            >
              {t('common.cancel') || "Отмена"}
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {t('sidebar.deleteChat') || "Удалить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!roomInfoDialogId} onOpenChange={(open) => !open && setRoomInfoDialogId(null)}>
        <DialogContent className="bg-[#0F172A] border-white/10 text-white p-0 overflow-hidden max-w-md w-full h-[80vh] flex flex-col">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle className="sr-only">{t('roomInfo.title') || "Информация о комнате"}</DialogTitle>
          </DialogHeader>
          {roomInfoDialogId && (
            <div className="flex-1 overflow-y-auto">
              <RoomInfo roomId={roomInfoDialogId} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
