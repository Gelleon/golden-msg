"use client"

import { useState, useRef, useEffect } from "react"
import { Download, Play, Pause, Loader2, FileText, CheckCircle2, Languages, Image as ImageIcon, Trash2, AlertTriangle, Pencil, X, Check, Reply, CornerUpLeft, Copy, Pin } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

import { useTranslation } from "@/lib/language-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { deleteMessage, updateMessage, pinMessage, unpinMessage } from "@/app/actions/chat"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { splitTextWithMentions } from "@/lib/chat-mentions"
import { AudioVisualizerComponent } from "@/components/ui/audio-visualizer-react"
import { VoiceMessage } from "@/components/ui/voice-message"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

interface Message {
  id: string
  content_original: string
  content_translated: string | null
  language_original: string
  message_type: string
  file_url: string | null
  voice_transcription: string | null
  created_at: string
  is_edited?: boolean
  is_pinned?: boolean
  translation_status?: string
  sender: {
    id: string
    full_name: string | null
    avatar_url: string | null
    role: string
  }
  reply_to?: {
    id: string
    content: string | null
    sender_name: string | null
  } | null
}

interface MessageBubbleProps {
  message: Message
  isCurrentUser: boolean
  onReply?: (message: Message) => void
  onDelete?: (messageId: string) => void
  showSenderName?: boolean
  showAvatar?: boolean
  roomId?: string
  currentUserRole?: string
  participants?: Array<{
    id: string
    full_name: string | null
  }>
}

const GENTLE_COLORS = [
  "text-blue-500",
  "text-rose-500",
  "text-emerald-500",
  "text-amber-500",
  "text-violet-500",
  "text-cyan-500",
  "text-pink-500",
  "text-indigo-500",
]

const getUserColor = (userId: string) => {
  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash)
  }
  return GENTLE_COLORS[Math.abs(hash) % GENTLE_COLORS.length]
}

const isImage = (url: string | null) => {
  if (!url) return false
  const cleanUrl = url.split('#')[0].split('?')[0]
  const ext = cleanUrl.split('.').pop()?.toLowerCase()
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')
}

const isAudio = (url: string | null) => {
  if (!url) return false
  const cleanUrl = url.split('#')[0].split('?')[0]
  const ext = cleanUrl.split('.').pop()?.toLowerCase()
  return ['mp3', 'wav', 'ogg', 'm4a', 'aac', 'webm'].includes(ext || '')
}

export function MessageBubble({ roomId, message, isCurrentUser, onReply, onDelete, showSenderName, showAvatar = true, currentUserRole, participants = [] }: MessageBubbleProps) {
  const { t } = useTranslation()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(message.content_original)
  const [isUpdating, setIsUpdating] = useState(false)
  const [mounted, setMounted] = useState(false)
  const isMountedRef = useRef(false)
  
  // To identify if the CURRENT user is an admin, we check the prop or fallback to localStorage
  const isCurrentUserAdmin = currentUserRole === "admin" || 
                            (typeof window !== 'undefined' && localStorage.getItem('user_role') === 'admin')
  
  const canDelete = isCurrentUser || isCurrentUserAdmin
  const canEdit = isCurrentUser

  useEffect(() => {
    if (mounted && isCurrentUserAdmin) {
      console.log(`[DEBUG] Message ${message.id} from ${message.sender.full_name}: canDelete=${canDelete}, role=${currentUserRole}, isCurrentUser=${isCurrentUser}`);
    }
  }, [mounted, isCurrentUser, isCurrentUserAdmin, canDelete, currentUserRole, message.id, message.sender.full_name]);

  useEffect(() => {
    setMounted(true)
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const { toast } = useToast()
  const mentionSegments = splitTextWithMentions(message.content_original || "", participants)

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(message.content_original)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handlePin = async () => {
    console.log(`[HANDLE PIN] messageId: ${message.id}, roomId: ${roomId}`);
    if (!roomId) return;
    const res = await pinMessage(message.id, roomId);
    if (res?.error) {
      toast({ title: t("settings_status.error") || "Error", description: res.error, variant: "destructive" });
    } else {
      toast({ title: t("settings_status.success") || "Success", description: t("chat.messageUpdated") || "Message pinned" });
    }
  }

  const handleUnpin = async () => {
    console.log(`[HANDLE UNPIN] messageId: ${message.id}, roomId: ${roomId}`);
    if (!roomId) return;
    const res = await unpinMessage(message.id, roomId);
    if (res?.error) {
      toast({ title: t("settings_status.error") || "Error", description: res.error, variant: "destructive" });
    } else {
      toast({ title: t("settings_status.success") || "Success", description: t("chat.messageUpdated") || "Message unpinned" });
    }
  }

  const handleUpdate = async () => {
    if (!editContent.trim() || editContent === message.content_original) {
      setIsEditing(false)
      return
    }

    setIsUpdating(true)
    const result = await updateMessage(message.id, editContent)
    
    if (!isMountedRef.current) return

    if (result.success) {
      setIsEditing(false)
      toast({
        title: t("chat.messageUpdated"),
      })
    } else {
      toast({
        title: t("chat.updateError"),
        description: result.error,
        variant: "destructive",
      } as any)
    }
    setIsUpdating(false)
  }

  useEffect(() => {
    setEditContent(message.content_original)
  }, [message.content_original])

  const handleDelete = async () => {
    setIsDeleting(true)
    const result = await deleteMessage(message.id)
    
    if (!isMountedRef.current) return

    if (result.success) {
      setShowDeleteConfirm(false)
      onDelete?.(message.id)
    } else {
      toast({
        title: t("chat.deleteError"),
        description: result.error || t("chat.deleteErrorDesc"),
        variant: "destructive",
      } as any)
      setIsDeleting(false)
    }
  }

  const renderLanguageIndicator = (isTranslated = false) => {
    const sourceLang = message.language_original === "ru" ? "RU" : "CN"
    const targetLang = message.language_original === "ru" ? "CN" : "RU"

    return (
      <div className={cn(
        "flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider mb-2 w-fit",
        isCurrentUser 
          ? "bg-white/10 text-blue-100" 
          : "bg-slate-100 text-slate-500"
      )}>
        <Languages className="h-3 w-3" />
        <span>{sourceLang}</span>
        {isTranslated && (
          <>
            <span className="opacity-50">→</span>
            <span className={cn(isCurrentUser ? "text-white" : "text-blue-600")}>{targetLang}</span>
            <CheckCircle2 className="h-2.5 w-2.5 ml-0.5 text-emerald-500" />
          </>
        )}
      </div>
    )
  }

  const renderReplyPreview = () => {
    if (!message.reply_to) return null

    return (
      <div 
        className={cn(
          "mx-3 mt-2 p-2 border-l-2 flex flex-col gap-0.5 cursor-pointer hover:bg-black/5 transition-colors rounded-r-lg",
          isCurrentUser 
            ? "border-blue-200 bg-white/10" 
            : "border-blue-500 bg-blue-50/50"
        )}
        onClick={() => {
          const element = document.getElementById(`message-${message.reply_to?.id}`)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' })
            element.classList.add('bg-blue-100/50')
            setTimeout(() => element.classList.remove('bg-blue-100/50'), 2000)
          }
        }}
      >
        <div className={cn(
          "text-[10px] font-bold truncate",
          isCurrentUser ? "text-blue-200" : "text-blue-600"
        )}>
          {message.reply_to.sender_name}
        </div>
        <div className={cn(
          "text-[11px] truncate opacity-80",
          isCurrentUser ? "text-white/80" : "text-slate-600"
        )}>
          {message.reply_to.content}
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (message.message_type) {
      case "text":
        return (
          <div className="space-y-0 w-full">
            {renderReplyPreview()}
            {isEditing ? (
              <div className="p-3 space-y-3">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className={cn(
                    "min-h-[80px] text-sm md:text-[15px] leading-relaxed resize-none border-none focus-visible:ring-1",
                    isCurrentUser 
                      ? "bg-black/20 text-white placeholder:text-white/40 focus-visible:ring-white/30" 
                      : "bg-slate-50 text-slate-900 placeholder:text-slate-400 focus-visible:ring-blue-500/30"
                  )}
                  placeholder={t("chat.editPlaceholder")}
                  autoFocus
                />
                <div className="flex items-center justify-end gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className={cn(
                      "h-8 px-3 rounded-lg font-bold text-xs uppercase tracking-wider",
                      isCurrentUser ? "text-white/70 hover:bg-white/10 hover:text-white" : "text-slate-500 hover:bg-slate-100"
                    )}
                    onClick={() => {
                      setIsEditing(false)
                      setEditContent(message.content_original)
                    }}
                    disabled={isUpdating}
                  >
                    <X className="h-3.5 w-3.5 mr-1.5" />
                    {t("common.cancel")}
                  </Button>
                  <Button
                    size="sm"
                    className={cn(
                      "h-8 px-3 rounded-lg font-bold text-xs uppercase tracking-wider shadow-sm",
                      isCurrentUser 
                        ? "bg-white text-blue-600 hover:bg-blue-50" 
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    )}
                    onClick={handleUpdate}
                    disabled={isUpdating || !editContent.trim() || editContent === message.content_original}
                  >
                    {isUpdating ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <>
                        <Check className="h-3.5 w-3.5 mr-1.5" />
                        {t("common.save")}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className={cn(
                  "p-3.5 md:p-4 text-sm md:text-[15px] leading-relaxed transition-all duration-300",
                  isCurrentUser ? "text-white" : "text-slate-900"
                )}>
                  {renderLanguageIndicator(!!message.content_translated)}
                  <p className="whitespace-pre-wrap break-words overflow-wrap-anywhere font-medium">
                    {mentionSegments.map((segment, index) =>
                      segment.type === "mention" && segment.userId ? (
                        <Link
                          key={`${segment.value}-${index}`}
                          href={`/dashboard/profile/${segment.userId}`}
                          className={cn(
                            "font-semibold underline underline-offset-4 decoration-transparent hover:decoration-current transition-colors",
                            isCurrentUser ? "text-cyan-200 hover:text-cyan-100" : "text-blue-600 hover:text-blue-700"
                          )}
                        >
                          {segment.value}
                        </Link>
                      ) : (
                        <span key={`${segment.value}-${index}`}>{segment.value}</span>
                      )
                    )}
                  </p>
                </div>
                
                <AnimatePresence>
                  {message.content_translated && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className={cn(
                        "p-3.5 md:p-4 text-sm md:text-[15px] leading-relaxed border-t transition-all duration-300 overflow-hidden",
                        isCurrentUser 
                          ? "bg-black/10 border-white/10 text-blue-100" 
                          : "bg-amber-50/50 border-amber-100 text-slate-900"
                      )}
                    >
                      <div className={cn(
                        "text-[9px] md:text-[10px] mb-1.5 flex items-center gap-1.5 uppercase tracking-widest font-bold",
                        isCurrentUser ? "text-blue-300" : "text-amber-600"
                      )}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                        <span>{message.language_original === "ru" ? t("chat.translatedToCN") : t("chat.translatedToRU")}</span>
                      </div>
                      <p className="whitespace-pre-wrap break-words overflow-wrap-anywhere font-medium leading-relaxed">
                        {message.content_translated}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {!message.content_translated && message.translation_status !== "failed" && (
                  <div className={cn(
                    "px-4 py-2 border-t text-[10px] font-bold uppercase tracking-wider flex flex-col gap-1",
                    isCurrentUser ? "bg-black/10 border-white/10 text-white/50" : "bg-slate-50 border-slate-100 text-slate-400"
                  )}>
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>{t("chat.aiTranslation")}</span>
                    </div>
                    <div className="text-[8px] opacity-30">
                      ID: {message.id.substring(0, 8)} | Lang: {message.language_original}
                    </div>
                  </div>
                )}
                {message.translation_status === "failed" && (
                  <div className={cn(
                    "px-4 py-2 border-t text-[10px] font-bold uppercase tracking-wider flex flex-col gap-1",
                    isCurrentUser ? "bg-red-500/20 border-white/10 text-red-200" : "bg-red-50 border-red-100 text-red-500"
                  )}>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-3 w-3" />
                      <span>{t("chat.translationFailed") || "Translation failed"}</span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )
      case "voice":
        if (!message.file_url) return null;
        
        let voiceUrl = message.file_url;
        let voiceDuration = undefined;
        if (voiceUrl.includes("#d=")) {
          const parts = voiceUrl.split("#d=");
          voiceUrl = parts[0];
          const parsed = parseFloat(parts[1]);
          if (!isNaN(parsed)) voiceDuration = Math.round(parsed);
        }

        return (
          <div className="min-w-[250px] md:min-w-[300px]">
            <VoiceMessage
              src={voiceUrl}
              duration={voiceDuration}
              senderName={message.sender.full_name || undefined}
              isCurrentUser={isCurrentUser}
              className="w-full"
            />
          </div>
        )
      case "file":
        const isImg = isImage(message.file_url)
        const isAud = isAudio(message.file_url)
        
        if (isAud && message.file_url) {
          let audUrl = message.file_url;
          let audDuration = undefined;
          if (audUrl.includes("#d=")) {
            const parts = audUrl.split("#d=");
            audUrl = parts[0];
            const parsed = parseFloat(parts[1]);
            if (!isNaN(parsed)) audDuration = Math.round(parsed);
          }

          return (
            <div className="min-w-[250px] md:min-w-[300px]">
              <VoiceMessage
                src={audUrl}
                duration={audDuration}
                senderName={message.content_original || message.sender.full_name || undefined}
                isCurrentUser={isCurrentUser}
                className="w-full"
              />
            </div>
          )
        }

        return (
          <div className={cn("overflow-hidden transition-all",
              isCurrentUser ? "text-white" : "text-slate-900"
          )}>
            {isImg && message.file_url && (
              <div className="relative group">
                <img 
                  src={message.file_url} 
                  alt={message.content_original || "Image"} 
                  className="w-full max-h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => window.open(message.file_url!, '_blank')}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                   <ImageIcon className="text-white h-8 w-8" />
                </div>
              </div>
            )}
            <div className={cn("p-3 md:p-4 flex items-center gap-3 md:gap-4 transition-all",
                isImg ? (isCurrentUser ? "bg-black/20" : "bg-slate-50") : ""
            )}>
              <div className={cn("p-3 rounded-xl shadow-inner shrink-0", 
                  isCurrentUser ? "bg-white/10" : "bg-blue-50"
              )}>
                <FileText className={cn("h-6 w-6 md:h-7 md:w-7", isCurrentUser ? "text-blue-300" : "text-blue-600")} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn("text-sm md:text-[15px] font-bold truncate mb-2 whitespace-pre-wrap break-words overflow-wrap-anywhere", isCurrentUser ? "text-white" : "text-slate-900")}>
                  {message.content_original || t("chat.file")}
                </p>
                <div className="flex items-center gap-2">
                  <a
                    href={message.file_url || "#"}
                    download={message.content_original || "file"}
                    className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all shadow-sm",
                        isCurrentUser 
                          ? "bg-white text-blue-600 hover:bg-blue-50" 
                          : "bg-blue-600 text-white hover:bg-blue-700"
                    )}
                  >
                    <Download className="h-3.5 w-3.5" />
                    {t("chat.download")}
                  </a>
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  if (!mounted) {
    return (
      <div className={cn("flex w-full mb-6 group", isCurrentUser ? "justify-end" : "justify-start")}>
        <div className={cn("flex max-w-[85%] md:max-w-[75%] gap-3", isCurrentUser ? "flex-row-reverse" : "flex-row")}>
          <div className="flex-shrink-0 mt-1">
            <Avatar className="h-9 w-9 border-2 border-white/10 shadow-lg">
              <AvatarImage src={message.sender.avatar_url || ""} />
              <AvatarFallback className="bg-gradient-to-br from-slate-700 to-slate-800 text-white text-xs font-bold">
                {message.sender.full_name?.substring(0, 2).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className={cn("flex flex-col gap-1.5", isCurrentUser ? "items-end" : "items-start")}>
            <div className={cn("px-4 py-3 rounded-2xl shadow-sm border", isCurrentUser ? "bg-blue-600 text-white border-blue-500" : "bg-white text-slate-800 border-slate-100")}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content_original}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      id={`message-${message.id}`}
      layout
      initial={{ opacity: 0, x: isCurrentUser ? 20 : -20, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ 
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
      className={cn(
        "flex w-full gap-2 md:gap-3 mb-4 md:mb-6 group/bubble-container transition-colors duration-500 rounded-xl",
        isCurrentUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={cn(!showAvatar && "invisible")}
      >
        <Avatar className="h-7 w-7 md:h-8 md:w-8 mt-1 shrink-0 ring-2 ring-white shadow-sm">
          <AvatarImage src={message.sender.avatar_url || undefined} />
          <AvatarFallback className={cn("text-[9px] md:text-xs font-bold", isCurrentUser ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-700")}>
            {message.sender.full_name?.charAt(0) || "?"}
          </AvatarFallback>
        </Avatar>
      </motion.div>

      <ContextMenu>
        <ContextMenuTrigger asChild className="message-bubble-trigger">
          <div className={cn(
            "flex-1 relative group/bubble max-w-[85%] flex flex-col",
            isCurrentUser ? "items-end" : "items-start"
          )}>
            {isDeleting && (
              <div className="absolute inset-0 z-50 bg-white/50 dark:bg-black/50 backdrop-blur-[1px] rounded-2xl flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
              </div>
            )}
            
            <div className={cn(
              "flex items-center gap-2 group/bubble-content max-w-full",
              isCurrentUser ? "flex-row-reverse" : "flex-row"
            )}>
              <div className={cn(
                "rounded-[20px] shadow-sm transition-all duration-300 overflow-hidden relative",
                isCurrentUser 
                  ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white" 
                  : "bg-white text-slate-900 border border-slate-100",
                isCurrentUser && showSenderName && "rounded-tr-[5px]",
                isCurrentUser && !showSenderName && "rounded-tr-[20px]",
                !isCurrentUser && showSenderName && "rounded-tl-[5px]",
                !isCurrentUser && !showSenderName && "rounded-tl-[20px]",
                "hover:shadow-md max-w-[320px] sm:max-w-[400px]"
              )}>
                {showSenderName && !isCurrentUser && (
                  <div className={cn(
                    "px-4 pt-2.5 pb-0 text-[13px] font-bold leading-none select-none truncate max-w-full",
                    getUserColor(message.sender.id)
                  )}>
                    {message.sender.full_name}
                  </div>
                )}
                {renderContent()}
                
                {/* Message Info (Time & Status) */}
                <div className={cn(
                  "flex items-center gap-1 px-2 pb-1 justify-end",
                  isCurrentUser ? "text-white/70" : "text-slate-400"
                )}>
                  {message.is_edited && (
                    <span className="text-[9px] italic font-medium">{t("chat.edited")}</span>
                  )}
                  <span className="text-[10px] font-medium">
                    {new Date(message.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', hour12: false })}
                  </span>
                  {isCurrentUser && (
                    <Check className="h-3 w-3" />
                  )}
                </div>
              </div>
              
              {/* Actions - visible on hover */}
              {!isEditing && (
                <div className={cn(
                  "opacity-0 group-hover/bubble-content:opacity-100 transition-all duration-200 flex flex-col items-center gap-1 z-20 shrink-0",
                  isDeleting && "opacity-100"
                )}>
                  {roomId && !message.is_pinned && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 border-none shadow-sm"
                      onClick={handlePin}
                      title={t("chat.pin")}
                    >
                      <Pin className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  {roomId && message.is_pinned && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 rounded-full bg-orange-100 hover:bg-orange-200 text-orange-500 border-none shadow-sm"
                      onClick={handleUnpin}
                      title={t("chat.unpin")}
                    >
                      <Pin className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  {canEdit && message.message_type === "text" && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 border-none shadow-sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  {canDelete && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className={cn(
                      "h-7 w-7 rounded-full bg-slate-100 hover:bg-red-50 text-red-400 border-none shadow-sm",
                      isDeleting && "cursor-not-allowed"
                    )}
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-48 p-1.5 rounded-xl shadow-2xl border-slate-200/60 bg-white/95 backdrop-blur-sm">
          <ContextMenuItem 
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 focus:bg-blue-50 focus:text-blue-600 transition-colors cursor-pointer group"
            onClick={() => onReply?.(message)}
          >
            <Reply className="h-4 w-4 text-slate-400 group-focus:text-blue-500" />
            <span className="font-semibold text-sm">{t("chat.reply")}</span>
          </ContextMenuItem>

          {!message.is_pinned && (
            <ContextMenuItem 
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 focus:bg-blue-50 focus:text-blue-600 transition-colors cursor-pointer group"
              onClick={handlePin}
            >
              <Pin className="h-4 w-4 text-slate-400 group-focus:text-blue-500" />
              <span className="font-semibold text-sm">{t("chat.pin")}</span>
            </ContextMenuItem>
          )}

          {message.is_pinned && (
            <ContextMenuItem 
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-orange-600 focus:bg-orange-50 focus:text-orange-700 transition-colors cursor-pointer group"
              onClick={handleUnpin}
            >
              <Pin className="h-4 w-4 text-orange-400 group-focus:text-orange-500" />
              <span className="font-semibold text-sm">{t("chat.unpin")}</span>
            </ContextMenuItem>
          )}

          {message.message_type === "text" && (
            <ContextMenuItem 
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 focus:bg-blue-50 focus:text-blue-600 transition-colors cursor-pointer group"
              onClick={handleCopyText}
            >
              <Copy className="h-4 w-4 text-slate-400 group-focus:text-blue-500" />
              <span className="font-semibold text-sm">{t("common.copy")}</span>
            </ContextMenuItem>
          )}

          {canEdit && (
            <ContextMenuItem 
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 focus:bg-blue-50 focus:text-blue-600 transition-colors cursor-pointer group"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-4 w-4 text-slate-400 group-focus:text-blue-500" />
              <span className="font-semibold text-sm">{t("common.edit")}</span>
            </ContextMenuItem>
          )}

          {canDelete && (
            <ContextMenuItem 
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 focus:bg-red-50 focus:text-red-700 transition-colors cursor-pointer group"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="h-4 w-4 text-red-400 group-focus:text-red-500" />
              <span className="font-semibold text-sm">{t("common.delete")}</span>
            </ContextMenuItem>
          )}
        </ContextMenuContent>
      </ContextMenu>

      {/* Custom Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="sm:max-w-[400px] border-none shadow-2xl bg-white p-0 overflow-hidden rounded-3xl">
          <div className="p-6 pt-8 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-slate-900 text-center">
                {t("chat.deleteConfirmTitle")}
              </DialogTitle>
              <DialogDescription className="text-slate-500 text-center text-[15px] pt-2">
                {t("chat.deleteConfirmDesc")}
              </DialogDescription>
            </DialogHeader>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 p-6 bg-slate-50/50 sm:gap-3">
            <Button
              type="button"
              variant="ghost"
              className="flex-1 h-12 rounded-2xl font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isDeleting}
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="button"
              className="flex-1 h-12 rounded-2xl font-bold bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("chat.deleteConfirmDeleting")}
                </>
              ) : (
                t("chat.deleteConfirmConfirm")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
