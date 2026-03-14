"use client"

import { useState } from "react"
import { Download, Play, Pause, Loader2, FileText, CheckCircle2, Languages, Image as ImageIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

  const togglePlay = () => {
    if (!message.file_url) return

    if (isPlaying && audio) {
      audio.pause()
      setIsPlaying(false)
    } else {
      if (!audio) {
        const newAudio = new Audio(message.file_url)
        newAudio.onended = () => setIsPlaying(false)
        setAudio(newAudio)
        newAudio.play().catch((err) => console.error("Error playing audio:", err))
      } else {
        audio.play().catch((err) => console.error("Error playing audio:", err))
      }
      setIsPlaying(true)
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
          <div className="space-y-0">
            <div className={cn(
              "p-3.5 md:p-4 text-sm md:text-[15px] leading-relaxed transition-all duration-300",
              isCurrentUser ? "text-white" : "text-slate-900"
            )}>
              {renderLanguageIndicator(!!message.content_translated)}
              <p className="whitespace-pre-wrap font-medium">
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
                  <p className="whitespace-pre-wrap font-medium leading-relaxed">{message.content_translated}</p>
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
          <div className="min-w-[220px] md:min-w-[280px]">
            <div className={cn("flex items-center gap-3 md:gap-4 p-3 md:p-4 transition-all duration-300",
                isCurrentUser ? "text-white" : "text-slate-900"
            )}>
              <Button
                size="icon"
                className={cn("h-10 w-10 md:h-12 md:w-12 rounded-full shadow-lg transition-all active:scale-95 shrink-0",
                    isCurrentUser 
                      ? "bg-white text-blue-600 hover:bg-blue-50" 
                      : "bg-blue-600 text-white hover:bg-blue-700"
                )}
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4 md:h-5 md:w-5 fill-current" />
                ) : (
                  <Play className="h-4 w-4 md:h-5 md:w-5 ml-1 fill-current" />
                )}
              </Button>
              <div className="flex-1 min-w-0">
                {renderLanguageIndicator(!!message.content_translated)}
                {message.voice_transcription ? (
                  <p className={cn(
                    "text-xs md:text-sm font-medium italic truncate leading-snug",
                    isCurrentUser ? "text-white" : "text-slate-700"
                  )}>
                    "{message.voice_transcription}"
                  </p>
                ) : (
                  <div className={cn(
                    "flex items-center gap-1.5 text-[10px] md:text-xs font-bold uppercase tracking-tighter",
                    isCurrentUser ? "text-white/50" : "text-slate-400"
                  )}>
                    <div className="flex gap-0.5 items-center">
                      <div className="w-0.5 h-2 bg-current animate-[bounce_1s_infinite_0ms]" />
                      <div className="w-0.5 h-3 bg-current animate-[bounce_1s_infinite_200ms]" />
                      <div className="w-0.5 h-2 bg-current animate-[bounce_1s_infinite_400ms]" />
                    </div>
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
        "flex-1 max-w-[80%] md:max-w-[70%] rounded-2xl shadow-lg transition-all duration-300 overflow-hidden",
        isCurrentUser 
          ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white" 
          : "bg-white text-slate-900 border border-slate-200"
      )}>
        {renderContent()}
      </div>
    </motion.div>
  )
}
