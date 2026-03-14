"use client"

import { useState, useRef, useEffect } from "react"
import { Download, Play, Pause, Loader2, FileText, CheckCircle2, Languages, Image as ImageIcon, Trash2, AlertTriangle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { deleteMessage } from "@/app/actions/chat"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

interface Message {
  id: string
  content_original: string
  content_translated: string | null
  language_original: string
  message_type: string
  file_url: string | null
  voice_transcription: string | null
  created_at: string
  sender: {
    id: string
    full_name: string | null
    avatar_url: string | null
    role: string
  }
}

interface MessageBubbleProps {
  message: Message
  isCurrentUser: boolean
}

const isImage = (url: string | null) => {
  if (!url) return false
  const ext = url.split('.').pop()?.toLowerCase()
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')
}

export function MessageBubble({ message, isCurrentUser }: MessageBubbleProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState<number | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { toast } = useToast()

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
        title: "Сообщение удалено",
        description: "Ваше сообщение было успешно удалено из чата и с сервера.",
      })
      setShowDeleteConfirm(false)
    } else {
      toast({
        title: "Ошибка удаления",
        description: result.error || "Не удалось удалить сообщение. Попробуйте позже.",
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

  const renderContent = () => {
    switch (message.message_type) {
      case "text":
        return (
          <div className="space-y-0 w-full">
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
                    <span>{message.language_original === "ru" ? "Перевод на китайский" : "Перевод на русский"}</span>
                  </div>
                  <p className="whitespace-pre-wrap break-words overflow-wrap-anywhere font-medium leading-relaxed">
                    {message.content_translated}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            
            {!message.content_translated && (
              <div className={cn(
                "px-4 py-2 border-t text-[10px] font-bold uppercase tracking-wider flex items-center gap-2",
                isCurrentUser ? "bg-black/10 border-white/10 text-white/50" : "bg-slate-50 border-slate-100 text-slate-400"
              )}>
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>AI Перевод...</span>
              </div>
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
                    <span>Расшифровка...</span>
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
                    {message.language_original === "ru" ? "Перевод на китайский" : "Перевод на русский"}
                  </div>
                  <p className="font-medium leading-relaxed">{message.content_translated}</p>
                </motion.div>
              )}
            </AnimatePresence>
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
                <p className={cn("text-sm md:text-[15px] font-bold truncate mb-2", isCurrentUser ? "text-white" : "text-slate-900")}>
                  {message.content_original || "Файл"}
                </p>
                <div className="flex items-center gap-2">
                  <a
                    href={message.file_url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all shadow-sm",
                        isCurrentUser 
                          ? "bg-white text-blue-600 hover:bg-blue-50" 
                          : "bg-blue-600 text-white hover:bg-blue-700"
                    )}
                  >
                    <Download className="h-3.5 w-3.5" />
                    Скачать
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

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: isCurrentUser ? 20 : -20, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ 
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
      className={cn(
        "flex w-full gap-2 md:gap-3 mb-4 md:mb-6",
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
      <div className={cn(
        "flex-1 max-w-[min(400px,80%)] md:max-w-[min(400px,70%)] rounded-2xl shadow-lg transition-all duration-300 relative group/bubble",
        isCurrentUser 
          ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white" 
          : "bg-white text-slate-900 border border-slate-200"
      )}>
        <div className={cn(
          "max-h-[200px] overflow-y-auto overflow-x-hidden custom-scrollbar",
          isCurrentUser ? "custom-scrollbar-white" : "custom-scrollbar-slate"
        )}>
          {renderContent()}
        </div>
        
        {/* Delete button - visible on hover for current user or admin */}
        {isCurrentUser && (
          <div className={cn(
            "absolute top-2 right-2 opacity-0 group-hover/bubble:opacity-100 transition-opacity",
            isDeleting && "opacity-100"
          )}>
            <Button
              size="icon"
              variant="ghost"
              className={cn(
                "h-7 w-7 rounded-full bg-black/20 hover:bg-red-500 hover:text-white text-white/70 border-none",
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

      {/* Custom Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="sm:max-w-[400px] border-none shadow-2xl bg-white p-0 overflow-hidden rounded-3xl">
          <div className="p-6 pt-8 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-slate-900 text-center">
                Удалить сообщение?
              </DialogTitle>
              <DialogDescription className="text-slate-500 text-center text-[15px] pt-2">
                Это действие необратимо. Сообщение и связанные с ним файлы будут полностью удалены с сервера.
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
              Отмена
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
                  Удаление...
                </>
              ) : (
                "Удалить"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
