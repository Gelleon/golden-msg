"use client"

import { useState, useRef, useEffect } from "react"
import { Download, Play, Pause, Loader2, FileText, CheckCircle2, Languages, Image as ImageIcon, Trash2, AlertTriangle, Pencil, X, Check, Reply, CornerUpLeft, Copy } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { useTranslation } from "@/lib/language-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { deleteMessage, updateMessage } from "@/app/actions/chat"
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
}

const isImage = (url: string | null) => {
  if (!url) return false
  const ext = url.split('.').pop()?.toLowerCase()
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')
}

export function MessageBubble({ message, isCurrentUser, onReply }: MessageBubbleProps) {
  const { t } = useTranslation()
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState<number | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(message.content_original)
  const [isUpdating, setIsUpdating] = useState(false)
  const [mounted, setMounted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const { toast } = useToast()

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(message.content_original)
      toast({
        title: t('common.copied'),
        description: t('common.textCopiedToClipboard'),
      })
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleUpdate = async () => {
    if (!editContent.trim() || editContent === message.content_original) {
      setIsEditing(false)
      return
    }

    setIsUpdating(true)
    const result = await updateMessage(message.id, editContent)

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

  useEffect(() => {
    if (message.message_type === "voice" && message.file_url) {
      const audio = new Audio(message.file_url)
      audio.onloadedmetadata = () => {
        setDuration(audio.duration)
      }
      audio.onended = () => {
        setIsPlaying(false)
        setCurrentTime(0)
      }
      audio.ontimeupdate = () => {
        setCurrentTime(audio.currentTime)
      }
      audioRef.current = audio
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [message.message_type, message.file_url])

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play().catch((err) => console.error("Error playing audio:", err))
      setIsPlaying(true)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    const result = await deleteMessage(message.id)
    
    if (result.success) {
      toast({
        title: t("chat.messageDeleted"),
        description: t("chat.messageDeletedDesc"),
      })
      setShowDeleteConfirm(false)
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
                    {message.content_original}
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
        return (
          <div className="min-w-[180px] md:min-w-[220px]">
            <div className={cn("flex items-center gap-3 p-3 transition-all duration-300",
                isCurrentUser ? "text-white" : "text-slate-900"
            )}>
              <Button
                size="icon"
                className={cn("h-10 w-10 rounded-full shadow-lg transition-all active:scale-95 shrink-0",
                    isCurrentUser 
                      ? "bg-white text-blue-600 hover:bg-blue-50" 
                      : "bg-blue-600 text-white hover:bg-blue-700"
                )}
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4 fill-current" />
                ) : (
                  <Play className="h-4 w-4 ml-1 fill-current" />
                )}
              </Button>
              <div className="flex-1 min-w-0 space-y-1">
                {renderLanguageIndicator(!!message.content_translated)}
                
                {/* Waveform visualizer */}
                <div className="flex items-center gap-0.5 h-6">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        height: isPlaying ? [4, Math.random() * 16 + 4, 4] : 4
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        delay: i * 0.05
                      }}
                      className={cn(
                        "w-1 rounded-full",
                        isCurrentUser ? "bg-white/40" : "bg-blue-200"
                      )}
                    />
                  ))}
                  <span className={cn(
                    "ml-2 text-[10px] font-mono font-bold",
                    isCurrentUser ? "text-white/80" : "text-slate-500"
                  )}>
                    {isPlaying ? formatTime(currentTime) : (duration ? formatTime(duration) : "0:00")}
                  </span>
                </div>

                {message.voice_transcription ? (
                  <p className={cn(
                    "text-[11px] md:text-xs font-medium italic truncate opacity-80",
                    isCurrentUser ? "text-white" : "text-slate-700"
                  )}>
                    "{message.voice_transcription}"
                  </p>
                ) : (
                  <div className={cn(
                    "flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-tighter opacity-60",
                    isCurrentUser ? "text-white" : "text-slate-400"
                  )}>
                    <span>{t("chat.transcription")}</span>
                  </div>
                )}
              </div>
            </div>
            <AnimatePresence>
              {message.content_translated && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className={cn("p-3 md:p-4 text-sm md:text-[15px] leading-relaxed border-t transition-all duration-300 overflow-hidden",
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
                    {message.language_original === "ru" ? t("chat.translatedToCN") : t("chat.translatedToRU")}
                  </div>
                  <p className="font-medium leading-relaxed">{message.content_translated}</p>
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
          </div>
        )
      case "file":
        const isImg = isImage(message.file_url)
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
                {message.content_original && renderLanguageIndicator(!!message.content_translated)}
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

            {message.content_original && (
              <>
                <AnimatePresence>
                  {message.content_translated && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className={cn("p-3 md:p-4 text-sm md:text-[15px] leading-relaxed border-t transition-all duration-300 overflow-hidden",
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
                        {message.language_original === "ru" ? t("chat.translatedToCN") : t("chat.translatedToRU")}
                      </div>
                      <p className="font-medium leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere">
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
            "flex-1 relative group/bubble max-w-fit min-w-[60px]",
            isCurrentUser ? "flex flex-col items-end" : "flex flex-col items-start"
          )}>
            <div className={cn(
              "rounded-[20px] shadow-sm transition-all duration-300 overflow-hidden relative",
              isCurrentUser 
                ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-[5px]" 
                : "bg-white text-slate-900 border border-slate-100 rounded-tl-[5px]",
              "hover:shadow-md max-w-[320px] sm:max-w-[400px]"
            )}>
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
            
            {/* Actions - visible on hover for current user */}
            {isCurrentUser && !isEditing && (
              <div className={cn(
                "absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover/bubble:opacity-100 transition-opacity flex flex-col items-center gap-1",
                isDeleting && "opacity-100"
              )}>
                {message.message_type === "text" && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 border-none shadow-sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                )}
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
              </div>
            )}
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

          {message.message_type === "text" && (
            <ContextMenuItem 
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 focus:bg-blue-50 focus:text-blue-600 transition-colors cursor-pointer group"
              onClick={handleCopyText}
            >
              <Copy className="h-4 w-4 text-slate-400 group-focus:text-blue-500" />
              <span className="font-semibold text-sm">{t("common.copy")}</span>
            </ContextMenuItem>
          )}

          {isCurrentUser && (
            <>
              <ContextMenuItem 
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 focus:bg-blue-50 focus:text-blue-600 transition-colors cursor-pointer group"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-4 w-4 text-slate-400 group-focus:text-blue-500" />
                <span className="font-semibold text-sm">{t("common.edit")}</span>
              </ContextMenuItem>
              <ContextMenuItem 
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 focus:bg-red-50 focus:text-red-700 transition-colors cursor-pointer group"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="h-4 w-4 text-red-400 group-focus:text-red-500" />
                <span className="font-semibold text-sm">{t("common.delete")}</span>
              </ContextMenuItem>
            </>
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
