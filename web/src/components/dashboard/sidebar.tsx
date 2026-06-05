/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState, useMemo, useCallback, useRef } from "react"
import Link from "next/link"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { LogOut, Plus, Settings, User, MessageSquare, Users, Search, Building2, ChevronRight, ChevronDown, Hash, Edit, Trash2, Info, UserPlus, ShieldCheck } from "lucide-react"
import { logout } from "@/app/actions/auth"
import { getRooms, createRoom, getDMs, searchUsers, startDM, deleteRoom, addParticipant, addParticipants, searchUsersForRoomPaginated } from "@/app/actions/room"

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
  const [newRoomDescription, setNewRoomDescription] = useState("")
  const [parentRoomIdForNewRoom, setParentRoomIdForNewRoom] = useState<string | null>(null)
  const [expandedRooms, setExpandedRooms] = useState<Record<string, boolean>>({})
  const [isRoomDialogOpen, setIsRoomDialogOpen] = useState(false)
  const [isDMDialogOpen, setIsDMDialogOpen] = useState(false)
  const [isAddUserToDMDialogOpen, setIsAddUserToDMDialogOpen] = useState(false)
  const [targetDMId, setTargetDMId] = useState<string | null>(null)
  const [dmSearchQuery, setDmSearchQuery] = useState("")
  const [dmSearchResults, setDmSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [selectedDMUserIds, setSelectedDMUserIds] = useState<string[]>([])
  const [editingRoom, setEditingRoom] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)
  const [roomInfoDialogId, setRoomInfoDialogId] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const dbgLastSigRef = useRef<string>("")

  // #region debug-point H:init
  const dbg = useCallback((hypothesisId: string, msg: string, data: Record<string, any> = {}, traceId?: string) => {
    if (typeof window === "undefined") return
    fetch("/api/trae-debug/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        runId: "pre",
        hypothesisId,
        location: "sidebar.tsx",
        traceId,
        msg: `[DEBUG] ${msg}`,
        data,
      }),
    }).catch(() => {})
  }, [])
  // #endregion

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

  const toggleRoomExpansion = (roomId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setExpandedRooms(prev => ({ ...prev, [roomId]: !prev[roomId] }))
  }

  const handleCreateSubRoom = (roomId: string) => {
    setParentRoomIdForNewRoom(roomId)
    setIsRoomDialogOpen(true)
  }

  const buildTree = useCallback((roomsList: any[]) => {
    const map = new Map<string, any>()
    roomsList.forEach(r => map.set(r.id, { ...r, children: [] }))

    const attached = new Set<string>()

    const wouldCreateCycle = (nodeId: string, parentId: string) => {
      let currentId: string | null | undefined = parentId
      let guard = 0
      while (currentId && guard < 100) {
        if (currentId === nodeId) return true
        const current = map.get(currentId)
        currentId = current?.parent_id
        guard++
      }
      return false
    }

    for (const r of roomsList) {
      const node = map.get(r.id)
      const parentId = r.parent_id
      if (!parentId) continue
      if (parentId === r.id) continue
      const parent = map.get(parentId)
      if (!parent) continue
      if (wouldCreateCycle(r.id, parentId)) continue
      parent.children.push(node)
      attached.add(r.id)
    }

    const roots = Array.from(map.values()).filter(n => !attached.has(n.id))

    // #region debug-point H3:tree
    const sig = `tree:${roomsList.length}:${roots.length}:${attached.size}`
    if (roots.length === 0 && dbgLastSigRef.current !== sig) {
      dbgLastSigRef.current = sig
      dbg("H3", "buildTree produced no roots (fallback to flat list)", { rooms: roomsList.length, roots: roots.length, attached: attached.size })
    }
    // #endregion

    return roots.length > 0 ? roots : Array.from(map.values())
  }, [])

  const rootRooms = useMemo(() => buildTree(rooms), [rooms, buildTree])

  const renderRoom = (room: any, depth: number = 0) => {
    const isExpanded = expandedRooms[room.id]
    const hasChildren = room.children && room.children.length > 0
    const paddingLeft = Math.min(depth, 10) * 16

    // Calculate total unread including children
    const getDeepUnreadCount = (r: any): number => {
      let count = r.unreadCount || 0;
      if (r.children) {
        for (const child of r.children) {
          count += getDeepUnreadCount(child);
        }
      }
      return count;
    };

    const totalUnread = getDeepUnreadCount(room);
    const hasUnread = totalUnread > 0;
    const isDirectUnread = (room.unreadCount || 0) > 0;
    const displayUnread = (!isExpanded && hasChildren) ? totalUnread : (room.unreadCount || 0);
    const showBadge = displayUnread > 0 && pathname !== `/dashboard/rooms/${room.id}`;

    return (
      <div key={room.id} className="w-full">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <ContextMenu>
            <ContextMenuTrigger asChild className="sidebar-item-trigger">
              <div className="relative group">
                {/* Toggle button - placed outside Link to avoid event conflicts */}
                <div className="absolute left-1 top-1/2 -translate-y-1/2 z-20" style={{ marginLeft: `${paddingLeft}px` }}>
                  {hasChildren ? (
                    <button
                      onClick={(e) => toggleRoomExpansion(room.id, e)}
                      className="w-6 h-6 flex items-center justify-center hover:bg-white/10 rounded-md cursor-pointer text-slate-500 hover:text-white transition-colors outline-none focus:ring-1 focus:ring-white/20"
                      aria-label={isExpanded ? "Collapse" : "Expand"}
                    >
                      {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </button>
                  ) : (
                    <div className="w-6 h-6 flex items-center justify-center pointer-events-none">
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full transition-all duration-300 shrink-0",
                        pathname === `/dashboard/rooms/${room.id}` ? "bg-amber-500 scale-125" : "bg-slate-700 group-hover:bg-slate-500"
                      )} />
                    </div>
                  )}
                </div>

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
                      style={{ paddingLeft: `${24 + paddingLeft}px` }}
                    >
                      <div className="flex flex-col min-w-0 flex-1">
                        <div className="flex items-center">
                          <span className={cn(
                            "truncate flex-1 text-left transition-colors flex items-center gap-1.5",
                            hasUnread ? "font-bold text-white" : "font-medium"
                          )}>
                            {room.is_buffer && <ShieldCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                            {room.is_buffer ? (t('room.bufferName') || room.name) : room.name}
                          </span>
                          {showBadge && (
                            <span className="flex h-5 min-w-[20px] shrink-0 items-center justify-center rounded-full bg-amber-500 px-1.5 text-[10px] font-bold text-white shadow-lg shadow-amber-500/20 ml-2 animate-pulse">
                              {displayUnread}
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
                          <span className={cn(
                            "text-[10px] mt-0.5 truncate text-left pr-2 min-w-0 w-full",
                            hasUnread ? "text-slate-400 font-medium" : "text-slate-500 font-normal"
                          )}>
                            {room.description}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-56 bg-[#1E293B] border-white/10 text-slate-200">
              <ContextMenuItem 
                onClick={() => setRoomInfoDialogId(room.id)}
                className="hover:bg-white/10 focus:bg-white/10 cursor-pointer"
              >
                <Info className="mr-2 h-4 w-4 text-blue-400" />
                <span>{t('roomInfo.title') || "Информация о комнате"}</span>
              </ContextMenuItem>
              {canCreateRoom && (
                <ContextMenuItem 
                  onClick={() => handleCreateSubRoom(room.id)}
                  className="hover:bg-white/10 focus:bg-white/10 cursor-pointer"
                >
                  <Plus className="mr-2 h-4 w-4 text-green-400" />
                  <span>{t('sidebar.createSubRoom') || "Создать подкомнату"}</span>
                </ContextMenuItem>
              )}
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
        {isExpanded && hasChildren && (
          <div className="flex flex-col mt-1">
            {room.children.map((child: any) => renderRoom(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  const fetchRoomsAndDMs = async () => {
    // #region debug-point H2:fetch-start
    const traceId = (globalThis as any)?.crypto?.randomUUID?.() || `${Date.now()}`
    dbg("H2", "fetchRoomsAndDMs start", {}, traceId)
    // #endregion
    try {
      const [fetchedRooms, fetchedDMs] = await Promise.all([
        getRooms(),
        getDMs()
      ])
      
      // Sort rooms by created_at or name if needed, or just set them
      setRooms(prev => (fetchedRooms.length === 0 && prev.length > 0 ? prev : fetchedRooms))
      setDms(prev => (fetchedDMs.length === 0 && prev.length > 0 ? prev : fetchedDMs))

      // #region debug-point H2:fetch-ok
      dbg("H2", "fetchRoomsAndDMs ok", { fetchedRooms: fetchedRooms.length, fetchedDMs: fetchedDMs.length }, traceId)
      // #endregion
    } catch (error) {
      // #region debug-point H2:fetch-err
      dbg("H2", "fetchRoomsAndDMs error", { error: String(error) }, traceId)
      // #endregion
      console.error("Error fetching rooms/DMs:", error)
    }
  }

  useEffect(() => {
    fetchRoomsAndDMs()
    
    // Polling every 30 seconds instead of 5 to reduce server load
    const interval = setInterval(fetchRoomsAndDMs, 30000)

    // Global SSE for real-time unread updates
    const sse = new EventSource(`/api/sse?global=true`);
    sse.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "unread_update") {
          fetchRoomsAndDMs();
        }
      } catch (e) {
        // Ignore parse errors
      }
    };

    return () => {
      clearInterval(interval);
      sse.close();
    }
  }, [user.id])

  // Auto-expand parents of active room
  useEffect(() => {
    if (!pathname || rootRooms.length === 0) return
    
    const currentRoomId = pathname.split("/").pop()
    if (!currentRoomId) return

    const toExpand: string[] = []

    const findAndExpandParents = (roomsList: any[], targetId: string): boolean => {
      for (const room of roomsList) {
        if (room.id === targetId) return true;
        if (room.children && room.children.length > 0) {
          if (findAndExpandParents(room.children, targetId)) {
            toExpand.push(room.id)
            return true;
          }
        }
      }
      return false;
    };

    findAndExpandParents(rootRooms, currentRoomId)
    
    if (toExpand.length === 0) return

    setExpandedRooms(prev => {
      let changed = false
      const next = { ...prev }
      for (const id of toExpand) {
        if (!next[id]) {
          next[id] = true
          changed = true
        }
      }
      return changed ? next : prev
    })
  }, [pathname, rootRooms])

  useEffect(() => {
    if (!mounted) return;
    const totalUnread = rooms.reduce((acc, r) => acc + (r.unreadCount || 0), 0) + 
                        dms.reduce((acc, r) => acc + (r.unreadCount || 0), 0);
    
    if (totalUnread > 0) {
      document.title = `(${totalUnread}) Golden Russia`;
    } else {
      document.title = `Golden Russia`;
    }
  }, [rooms, dms, mounted])

  const handleSignOut = async () => {
    await logout()
  }

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) return

    try {
      // #region debug-point H2:create-start
      const traceId = (globalThis as any)?.crypto?.randomUUID?.() || `${Date.now()}`
      dbg("H2", "createRoom start", { name: newRoomName, parentRoomId: parentRoomIdForNewRoom }, traceId)
      // #endregion

      const result = await createRoom(newRoomName, newRoomDescription, parentRoomIdForNewRoom || undefined)

      if (result.success && result.room) {
        const createdAt = typeof (result.room as any).created_at === "string"
          ? (result.room as any).created_at
          : new Date((result.room as any).created_at).toISOString()

        const normalizedRoom = {
          id: (result.room as any).id,
          parent_id: parentRoomIdForNewRoom || (result.room as any).parent_id || null,
          name: (result.room as any).name ?? newRoomName,
          type: (result.room as any).type ?? "group",
          description: (result.room as any).description ?? newRoomDescription ?? null,
          created_at: createdAt,
          unreadCount: 0,
          lastReadAt: new Date(0).toISOString(),
          is_buffer: (result.room as any).is_buffer ?? false,
        }

        setRooms(prev => {
          const next = [normalizedRoom, ...prev.filter(r => r.id !== normalizedRoom.id)]
          next.sort((a, b) => {
            if (a.is_buffer && !b.is_buffer) return -1
            if (!a.is_buffer && b.is_buffer) return 1
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          })
          return next
        })
        if (parentRoomIdForNewRoom) {
          setExpandedRooms(prev => ({ ...prev, [parentRoomIdForNewRoom]: true }))
        }

        // #region debug-point H1:body-style
        dbg(
          "H1",
          "post-create DOM/body state",
          {
            bodyOverflowInline: document.body.style.overflow,
            bodyPaddingRightInline: document.body.style.paddingRight,
            bodyOverflowComputed: getComputedStyle(document.body).overflow,
            bodyPaddingRightComputed: getComputedStyle(document.body).paddingRight,
          },
          traceId
        )
        // #endregion

        setNewRoomName("")
        setNewRoomDescription("")
        setParentRoomIdForNewRoom(null)
        setIsRoomDialogOpen(false)

        const nextHref = `/dashboard/rooms/${normalizedRoom.id}`
        setTimeout(() => {
          document.body.style.overflow = ""
          document.body.style.paddingRight = ""
          document.documentElement.style.overflow = ""
          document.body.removeAttribute("data-scroll-locked")
          onClose?.()
          router.push(nextHref, { scroll: false })
          fetchRoomsAndDMs()
        }, 0)

        // #region debug-point H2:create-ok
        dbg("H2", "createRoom ok", { roomId: normalizedRoom.id, parentId: normalizedRoom.parent_id }, traceId)
        // #endregion
      } else {
        // #region debug-point H2:create-fail
        dbg("H2", "createRoom failed", { error: result.error || null, details: (result as any).details || null }, traceId)
        // #endregion
        console.error("Error creating room:", result.error, result.details)
        alert((result.error || "Failed to create room") + (result.details ? `: ${result.details}` : ""))
      }
    } catch (error: any) {
      // #region debug-point H2:create-err
      dbg("H2", "createRoom exception", { error: String(error) }, (globalThis as any)?.crypto?.randomUUID?.() || `${Date.now()}`)
      // #endregion
      console.error("Failed to create room:", error)
      alert("Произошла ошибка при создании комнаты. Пожалуйста, попробуйте позже.")
    }
  }

  const performSearch = async (query: string) => {
    setIsSearching(true)
    try {
      if (isAddUserToDMDialogOpen && targetDMId) {
        const result = await searchUsersForRoomPaginated(targetDMId, query, 1, 50)
        setDmSearchResults((result?.users || []).filter((u: any) => u?.role !== "client"))
      } else {
        if (!selectedRoomId) {
          setDmSearchResults([])
          return
        }
        const result = await searchUsersForRoomPaginated(selectedRoomId, query, 1, 50)
        setDmSearchResults((result?.users || []).filter((u: any) => u?.role !== "client"))
      }
    } catch (error) {
      console.error("Error searching users:", error)
      setDmSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleManualSearch = () => {
    performSearch(dmSearchQuery);
  };

  useEffect(() => {
    if (!isDMDialogOpen && !isAddUserToDMDialogOpen) {
      setDmSearchQuery("");
      setDmSearchResults([]);
      setHasSearched(false);
      setSelectedDMUserIds([])
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
        if (isAddUserToDMDialogOpen && targetDMId) {
          const result = await searchUsersForRoomPaginated(targetDMId, dmSearchQuery, 1, 50)
          if (isMounted) {
            setDmSearchResults((result?.users || []).filter((u: any) => u?.role !== "client"))
          }
        } else {
          if (!selectedRoomId) {
            if (isMounted) {
              setDmSearchResults([])
              setHasSearched(true)
            }
          } else {
            const result = await searchUsersForRoomPaginated(selectedRoomId, dmSearchQuery, 1, 50)
            if (isMounted) {
              setDmSearchResults((result?.users || []).filter((u: any) => u?.role !== "client"))
            }
          }
        }
        if (isMounted) {
          setHasSearched(true)
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error searching users:", error);
          setDmSearchResults([]);
        }
      } finally {
        if (isMounted) {
          setIsSearching(false);
        }
      }
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDMDialogOpen, isAddUserToDMDialogOpen, dmSearchQuery, targetDMId, selectedRoomId]);

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

  const toggleSelectedDMUserId = (userId: string) => {
    setSelectedDMUserIds((prev) => prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId])
  }

  const handleAddUsersToDM = async () => {
    if (!targetDMId) return
    if (selectedDMUserIds.length === 0) return

    try {
      const result = await addParticipants(targetDMId, selectedDMUserIds)
      
      if (result.success) {
        setIsAddUserToDMDialogOpen(false)
        setTargetDMId(null)
        setSelectedDMUserIds([])
        fetchRoomsAndDMs()
        alert("Пользователи успешно добавлены")
      } else {
        alert(result.error || "Ошибка при добавлении пользователей")
      }
    } catch (error) {
      console.error("Error adding users to DM:", error)
      alert("Ошибка при добавлении пользователей")
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
      const deletedIdSet = new Set<string>(result.deletedIds || [])

      setRoomInfoDialogId(prev => (prev && deletedIdSet.has(prev) ? null : prev))
      setExpandedRooms(prev => {
        if (deletedIdSet.size === 0) return prev
        const next = { ...prev }
        deletedIdSet.forEach(id => {
          delete next[id]
        })
        return next
      })
      if (selectedRoomId && deletedIdSet.has(selectedRoomId)) {
        setSelectedRoomId(null)
      }
      if (editingRoom && deletedIdSet.has(editingRoom.id)) {
        setIsEditDialogOpen(false)
        setEditingRoom(null)
      }

      fetchRoomsAndDMs()
      const currentRoomId = pathname.split('/').pop()
      if (result.deletedIds?.includes(currentRoomId || '') || pathname === `/dashboard/rooms/${roomId}`) {
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
      const currentRoomId = pathname.split('/').pop()
      if (result.deletedIds?.includes(currentRoomId || '') || pathname === `/dashboard/rooms/${dmId}`) {
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
      className={cn("w-72 bg-[#0F172A] text-slate-100 flex flex-col h-full border-r border-white/5 shadow-2xl relative z-10 overflow-x-hidden", className)}
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
                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-semibold text-slate-300">{t('sidebar.roomDescription') || 'Описание'}</Label>
                        <div className="relative">
                          <Input
                            id="description"
                            value={newRoomDescription}
                            onChange={(e) => setNewRoomDescription(e.target.value)}
                            placeholder={t('sidebar.roomDescriptionPlaceholder') || 'Необязательное описание'}
                            className="px-4 bg-white/5 border-white/10 focus:border-amber-500 focus:ring-amber-500/20 text-white h-11 rounded-xl"
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
                {rootRooms.map((room) => renderRoom(room))}
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
                      {!selectedRoomId && (
                        <div className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2">
                          {t('sidebar.selectRoomForDM') || "Пожалуйста, выберите комнату"}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                          <Input
                            placeholder={t('sidebar.searchPlaceholder')}
                            value={dmSearchQuery}
                            onChange={(e) => setDmSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleManualSearch()}
                            className="pl-10 bg-white/5 border-white/10 focus:border-amber-500 focus:ring-amber-500/20 text-white h-11 rounded-xl"
                            disabled={!selectedRoomId}
                          />
                        </div>
                        <Button 
                          onClick={handleManualSearch} 
                          disabled={isSearching || !selectedRoomId}
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
                                className={cn(
                                  "flex items-center justify-between p-2 rounded-lg transition-colors cursor-pointer",
                                  selectedDMUserIds.includes(u.id) ? "bg-white/10" : "hover:bg-white/10"
                                )}
                                onClick={() => toggleSelectedDMUserId(u.id)}
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
                                <input
                                  type="checkbox"
                                  checked={selectedDMUserIds.includes(u.id)}
                                  onChange={() => toggleSelectedDMUserId(u.id)}
                                  onClick={(e) => e.stopPropagation()}
                                  className="h-4 w-4 accent-amber-500"
                                />
                              </div>
                            ))}
                          </div>
                        ) : hasSearched ? (
                          <div className="p-4 text-center text-sm text-slate-400">
                            {t('sidebar.noUsersFound')}
                          </div>
                        ) : null}
                      </ScrollArea>
                      <Button
                        onClick={handleAddUsersToDM}
                        disabled={selectedDMUserIds.length === 0}
                        className="w-full h-11 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold disabled:opacity-50 disabled:hover:bg-amber-500"
                      >
                        {t('sidebar.addUser') || "Добавить пользователя"}{selectedDMUserIds.length > 0 ? ` (${selectedDMUserIds.length})` : ""}
                      </Button>
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
                                  <AvatarImage src={dm.participantCount > 2 ? undefined : dm.otherUser?.avatar_url} />
                                  <AvatarFallback className="bg-slate-800 text-xs text-slate-400 font-bold">
                                    {(dm.displayName || (dm.participantCount > 2 ? t('room.group') : (dm.otherUser?.full_name || t('common.unknown'))))?.charAt(0) || "?"}
                                  </AvatarFallback>
                                </Avatar>
                                {(dm.participantCount > 2 ? dm.onlineCount > 0 : isUserOnline(dm.otherUserLastActiveAt)) && (
                                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0F172A] rounded-full" />
                                )}
                              </div>
                              <div className="flex flex-col items-start min-w-0 flex-1">
                                <span className={cn(
                                  "truncate w-full text-left transition-colors",
                                  dm.unreadCount > 0 ? "font-bold text-white" : "font-medium"
                                )}>
                                  {dm.displayName || (dm.participantCount > 2 ? t('room.group') : (dm.otherUser?.full_name || t('common.unknown')))}
                                </span>
                                <span className={cn(
                                  "text-[10px] font-bold uppercase tracking-wider leading-none mt-1 flex items-center gap-1 w-full",
                                  dm.unreadCount > 0 ? "text-slate-400" : "text-slate-500"
                                )}>
                                  {dm.participantCount > 2 ? (
                                    <>
                                      <span className={cn("normal-case font-medium", dm.unreadCount > 0 ? "text-white" : "text-slate-400")}>
                                        {dm.participantCount} {t('room.participantsCount')}
                                      </span>
                                      {dm.parentRoomName && (
                                        <>
                                          <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                                          <span className={cn("truncate normal-case font-medium", dm.unreadCount > 0 ? "text-white" : "text-slate-400")}>
                                            {dm.parentRoomName}
                                          </span>
                                        </>
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      <span>{roleLabels[dm.otherUser?.role] || dm.otherUser?.role}</span>
                                      {dm.parentRoomName && (
                                        <>
                                          <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                                          <span className={cn("truncate normal-case font-medium", dm.unreadCount > 0 ? "text-white" : "text-slate-400")}>
                                            {dm.parentRoomName}
                                          </span>
                                        </>
                                      )}
                                      {!dm.parentRoomName && dm.sharedRoomName && (
                                        <>
                                          <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                                          <span className={cn("truncate normal-case font-medium", dm.unreadCount > 0 ? "text-white" : "text-slate-400")}>
                                            {t('room.sharedRooms')}: {dm.sharedRoomName}
                                          </span>
                                        </>
                                      )}
                                    </>
                                  )}
                                </span>
                              </div>
                              {dm.unreadCount > 0 && pathname !== `/dashboard/rooms/${dm.id}` && (
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-amber-500 px-1.5 text-[10px] font-bold text-white shadow-lg shadow-amber-500/20 animate-pulse">
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
                              {dm.participantCount > 2 && (
                                <ContextMenuItem
                                  onClick={() => handleEditRoom(dm)}
                                  className="hover:bg-white/10 focus:bg-white/10 cursor-pointer"
                                >
                                  <Edit className="mr-2 h-4 w-4 text-slate-300" />
                                  <span>{t('common.edit') || "Изменить"}</span>
                                </ContextMenuItem>
                              )}
                              <ContextMenuItem 
                                onClick={() => {
                                  setTargetDMId(dm.id)
                                  setIsAddUserToDMDialogOpen(true)
                                  setSelectedDMUserIds([])
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
                      profile?.role === 'admin' ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" : 
                      profile?.role === 'manager' ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" :
                      "bg-slate-600"
                    )} />
                    {roleLabels[profile?.role] || profile?.role}
                    {profile?.is_buffer_accessible && <span className="text-amber-500/50 ml-1">✓</span>}
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
