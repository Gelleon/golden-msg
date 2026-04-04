"use client"

import { useEffect, useState, useCallback } from "react"
import { Pin, X, ChevronRight, ChevronLeft } from "lucide-react"
import { getPinnedMessages, unpinMessage } from "@/app/actions/chat"
import { useTranslation } from "@/lib/language-context"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface PinnedMessage {
  id: string
  content: string | null
  message_type: string
  file_url: string | null
  sender: {
    full_name: string | null
  }
}

interface PinnedMessagesBarProps {
  roomId: string
  onMessageClick: (messageId: string) => void
  currentUserRole?: string
}

export function PinnedMessagesBar({ roomId, onMessageClick, currentUserRole }: PinnedMessagesBarProps) {
  const { t } = useTranslation()
  const [messages, setMessages] = useState<PinnedMessage[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const isCurrentUserAdmin = currentUserRole === "admin" || 
                            (typeof window !== 'undefined' && localStorage.getItem('user_role') === 'admin')

  const fetchPinnedMessages = useCallback(async () => {
    try {
      const res = await getPinnedMessages(roomId)
      if (res.messages) {
        setMessages(res.messages)
        if (currentIndex >= res.messages.length) {
          setCurrentIndex(Math.max(0, res.messages.length - 1))
        }
      }
    } catch (err) {
      console.error("Failed to fetch pinned messages:", err)
    } finally {
      setIsLoading(false)
    }
  }, [roomId, currentIndex])

  useEffect(() => {
    fetchPinnedMessages()

    const sse = new EventSource(`/api/sse?roomId=${roomId}`)

    sse.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === 'pinned_messages_update') {
          fetchPinnedMessages()
        }
      } catch (e) {
        console.error("SSE Parse Error", e)
      }
    }

    return () => {
      sse.close()
    }
  }, [roomId, fetchPinnedMessages])

  if (isLoading || messages.length === 0) return null

  const currentMessage = messages[currentIndex]

  const handleUnpin = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await unpinMessage(currentMessage.id, roomId)
  }

  const nextMessage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev + 1) % messages.length)
  }

  const prevMessage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev - 1 + messages.length) % messages.length)
  }

  return (
    <div className="bg-white/95 backdrop-blur-md border-b border-orange-100 shadow-sm p-2.5 flex items-center justify-between cursor-pointer hover:bg-orange-50/50 transition-colors absolute top-0 left-0 right-0 z-20" onClick={() => onMessageClick(currentMessage.id)}>
      <div className="flex items-center gap-3 overflow-hidden flex-1">
        <div className="text-orange-500 bg-orange-100 dark:bg-orange-900/30 p-2 rounded-full flex-shrink-0">
          <Pin className="w-4 h-4" />
        </div>
        <div className="flex flex-col overflow-hidden w-full">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-slate-800 truncate">
              {t("chat.pinnedMessage") || "Pinned Message"}
            </span>
            {messages.length > 1 && (
              <span className="text-[10px] text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded-full font-medium">
                {currentIndex + 1}/{messages.length}
              </span>
            )}
          </div>
          <span className="text-xs text-slate-500 truncate mt-0.5">
            <span className="font-medium text-slate-700">{currentMessage.sender.full_name}:</span> {currentMessage.message_type === 'text' ? currentMessage.content : currentMessage.message_type}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0 ml-2">
        {messages.length > 1 && (
          <div className="flex items-center mr-2">
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={prevMessage}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={nextMessage}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100" onClick={handleUnpin}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
