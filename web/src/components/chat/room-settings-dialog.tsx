"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Settings, Trash2, UserPlus, Users, X, Search, ShieldCheck, Link as LinkIcon } from "lucide-react"
import { useTranslation } from "@/lib/language-context"
import { 
  getRoomParticipants, 
  addParticipant, 
  removeParticipant, 
  searchUsersForRoom 
} from "@/app/actions/room"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { InviteDialog } from "@/components/dashboard/invite-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface RoomSettingsDialogProps {
  roomId: string
  currentUserRole: string
  roomName: string
}

export function RoomSettingsDialog({
  roomId,
  currentUserRole,
  roomName,
}: RoomSettingsDialogProps) {
  const { t } = useTranslation()
  const roleLabels: Record<string, string> = {
    admin: t("roles.admin"),
    manager: t("roles.manager"),
    partner: t("roles.partner"),
    client: t("roles.client"),
  }
  const [participants, setParticipants] = useState<any[]>([])
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const canManage = ["admin", "manager"].includes(currentUserRole)

  const fetchParticipants = async () => {
    const data = await getRoomParticipants(roomId)
    setParticipants(data)
  }

  useEffect(() => {
    if (canManage) {
      const init = async () => {
        const data = await getRoomParticipants(roomId)
        setParticipants(data)
        
        // Fetch users after participants are loaded to filter correctly
        const users = await searchUsersForRoom("")
        if (users) {
          const existingIds = new Set(data.map((p: any) => p.id))
          setSearchResults(users.filter((u: any) => !existingIds.has(u.id)))
        }
      }
      init()
    }
  }, [roomId, canManage])

  const handleSearch = async (queryOverride?: string) => {
    const query = typeof queryOverride === 'string' ? queryOverride : searchQuery
    setIsLoading(true)
    const data = await searchUsersForRoom(query)
    
    if (data) {
      // Filter out existing participants
      const existingIds = new Set(participants.map((p) => p.id))
      setSearchResults(data.filter((p) => !existingIds.has(p.id)))
    }
    setIsLoading(false)
  }

  const handleAddParticipant = async (userId: string) => {
    const result = await addParticipant(roomId, userId)

    if (result.success) {
      fetchParticipants()
      setSearchResults((prev) => prev.filter((p) => p.id !== userId))
    }
  }

  const handleRemoveParticipant = async (userId: string) => {
    if (!confirm(t("roomSettings.removeConfirm"))) return

    const result = await removeParticipant(roomId, userId)

    if (result.success) {
      fetchParticipants()
    }
  }

  if (!canManage) return null

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-all">
            <Settings className="h-5 w-5" />
          </Button>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] bg-[#0F172A] border-white/10 text-white p-0 overflow-hidden rounded-3xl shadow-2xl">
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, ease: "circOut" }}
          className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-amber-600 origin-left" 
        />
        
        <DialogHeader className="p-8 pb-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 mb-2"
          >
            <motion.div 
              whileHover={{ rotate: 15 }}
              className="p-3 bg-amber-500/10 rounded-2xl"
            >
              <ShieldCheck className="h-6 w-6 text-amber-500" />
            </motion.div>
            <div>
              <DialogTitle className="text-2xl font-bold tracking-tight">{t("roomSettings.title")}</DialogTitle>
              <DialogDescription className="text-slate-400 font-medium">
                {roomName}
              </DialogDescription>
            </div>
          </motion.div>
        </DialogHeader>
        
        <Tabs defaultValue="participants" className="w-full">
          <div className="px-8 mb-6">
            <TabsList className="grid w-full grid-cols-2 bg-white/5 p-1.5 rounded-2xl h-14 relative">
              <TabsTrigger 
                value="participants" 
                className="rounded-xl data-[state=active]:bg-amber-500 data-[state=active]:text-white font-bold transition-all relative z-10"
              >
                <Users className="h-4 w-4 mr-2" />
                {t("roomSettings.participants")}
              </TabsTrigger>
              <TabsTrigger 
                value="invite" 
                className="rounded-xl data-[state=active]:bg-amber-500 data-[state=active]:text-white font-bold transition-all relative z-10"
              >
                <LinkIcon className="h-4 w-4 mr-2" />
                {t("roomSettings.invite")}
              </TabsTrigger>
            </TabsList>
          </div>
          
          <AnimatePresence mode="wait">
            <TabsContent value="participants" key="participants" className="px-8 pb-8 mt-0 focus-visible:outline-none outline-none">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between mb-4 px-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                    {t("roomSettings.totalParticipants")}: {participants.length}
                  </span>
                  <InviteDialog roomId={roomId} userRole={currentUserRole} />
                </div>
                <ScrollArea className="h-[320px] pr-4 -mr-4">
                  <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {participants.map((participant, index) => (
                        <motion.div 
                          key={participant.id}
                          layout
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ 
                            opacity: 1, 
                            x: 0,
                            transition: { delay: index * 0.05 }
                          }}
                          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                          whileHover={{ scale: 1.02, x: 4 }}
                          className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/20 hover:bg-white/[0.06] transition-all group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <motion.div whileHover={{ scale: 1.1 }}>
                                <Avatar className="h-11 w-11 ring-2 ring-white/10 group-hover:ring-amber-500/50 transition-all duration-300">
                                  <AvatarImage src={participant.avatar_url} />
                                  <AvatarFallback className="bg-slate-800 text-amber-500 font-bold">
                                    {participant.full_name?.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                              </motion.div>
                              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#0F172A] rounded-full shadow-lg" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-100 group-hover:text-white transition-colors tracking-tight">{participant.full_name}</p>
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 group-hover:text-amber-500/70 transition-colors">
                                {roleLabels[participant.role] || participant.role}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all md:opacity-0 md:group-hover:opacity-100"
                            onClick={() => handleRemoveParticipant(participant.id)}
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </Button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {participants.length === 0 && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-20 text-slate-500"
                      >
                        <div className="p-4 bg-white/5 rounded-full mb-4">
                          <Users className="h-10 w-10 opacity-20" />
                        </div>
                        <p className="text-sm font-bold tracking-tight text-slate-400">{t("roomSettings.noParticipantsFound")}</p>
                      </motion.div>
                    )}
                  </div>
                </ScrollArea>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="invite" key="invite" className="px-8 pb-8 mt-0 focus-visible:outline-none outline-none">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex gap-3 mb-6">
                  <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-amber-500 transition-colors" />
                    <Input
                      placeholder={t("sidebar.searchPlaceholder")}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      className="pl-11 bg-white/5 border-white/10 focus:border-amber-500 focus:ring-amber-500/20 text-white h-12 rounded-xl transition-all"
                    />
                  </div>
                  <Button 
                    onClick={() => handleSearch()} 
                    disabled={isLoading}
                    className="h-12 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Search className="h-4 w-4" />
                      </motion.div>
                    ) : t("sidebar.find")}
                  </Button>
                </div>
                
                <ScrollArea className="h-[280px] pr-4 -mr-4">
                  <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {searchResults.map((user, index) => (
                        <motion.div 
                          key={user.id}
                          layout
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ 
                            opacity: 1, 
                            x: 0,
                            transition: { delay: index * 0.05 }
                          }}
                          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                          whileHover={{ scale: 1.02, x: 4 }}
                          className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/20 hover:bg-white/[0.06] transition-all group"
                        >
                          <div className="flex items-center gap-4">
                            <motion.div whileHover={{ scale: 1.1 }}>
                              <Avatar className="h-11 w-11 ring-2 ring-white/10 group-hover:ring-amber-500/50 transition-all duration-300">
                                <AvatarImage src={user.avatar_url} />
                                <AvatarFallback className="bg-slate-800 text-amber-500 font-bold">
                                  {user.full_name?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                            </motion.div>
                            <div>
                              <p className="text-sm font-bold text-slate-100 group-hover:text-white transition-colors tracking-tight">{user.full_name}</p>
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 group-hover:text-amber-500/70 transition-colors">
                                {roleLabels[user.role] || user.role}
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            className="h-10 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-lg shadow-amber-500/20 transition-all active:scale-95"
                            onClick={() => handleAddParticipant(user.id)}
                          >
                            <UserPlus className="h-4 w-4 mr-2" />
                            {t("roomSettings.add")}
                          </Button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    
                    {searchResults.length === 0 && searchQuery && !isLoading && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-10 text-slate-500"
                      >
                        <div className="p-4 bg-white/5 rounded-full mb-4">
                          <Search className="h-10 w-10 opacity-20" />
                        </div>
                        <p className="text-sm font-bold text-slate-400">{t("sidebar.noUsersFound")}</p>
                      </motion.div>
                    )}
                    
                    {!searchQuery && searchResults.length === 0 && !isLoading && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-10 text-slate-500"
                      >
                        <div className="p-4 bg-white/5 rounded-full mb-4">
                          <Users className="h-10 w-10 opacity-20" />
                        </div>
                        <p className="text-sm font-bold text-slate-400">{t("sidebar.noUsersFound")}</p>
                      </motion.div>
                    )}
                  </div>
                </ScrollArea>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
