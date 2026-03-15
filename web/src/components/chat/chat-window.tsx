"use client"

import { useEffect, useRef, useState } from "react"
import { getMessages, markAsRead } from "@/app/actions/chat"
import { useTranslation } from "@/lib/language-context"
import { cn } from "@/lib/utils"

import { MessageBubble } from "@/components/chat/message-bubble"
import { MessageInput } from "@/components/chat/message-input"
import { motion, AnimatePresence } from "framer-motion"

interface ChatWindowProps {
  roomId: string
  initialMessages: any[]
  currentUser: any
  userProfile: any
  lastReadAt: string
  participants?: any[]
}

export function ChatWindow({
  roomId,
  initialMessages,
  currentUser,
  userProfile,
  lastReadAt,
  participants = [],
}: ChatWindowProps) {
  const { t } = useTranslation()
  const [messages, setMessages] = useState<any[]>(initialMessages)
  const [isTyping, setIsTyping] = useState(false)
  const [hasScrolledToUnread, setHasScrolledToUnread] = useState(false)
  const [showUnreadSeparator, setShowUnreadSeparator] = useState(true)
  const [currentLastReadAt, setCurrentLastReadAt] = useState(lastReadAt)
  const scrollRef = useRef<HTMLDivElement>(null)
  const unreadRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const otherParticipantsCount = participants.filter(p => p.id !== currentUser.id).length
  const messagesRef = useRef(messages)
  messagesRef.current = messages

  // Find the first unread message index (only once on load)
  const [firstUnreadIndex] = useState(() => 
    messages.findIndex(m => 
      new Date(m.created_at) > new Date(lastReadAt) && m.sender.id !== currentUser.id
    )
  )

  useEffect(() => {
    // Mark as read when entering room
    const doMarkAsRead = async () => {
      await markAsRead(roomId)
      setCurrentLastReadAt(new Date().toISOString())
    }
    doMarkAsRead()

    // Scroll to first unread or bottom
    if (!hasScrolledToUnread) {
      if (firstUnreadIndex !== -1 && unreadRef.current) {
        unreadRef.current.scrollIntoView({ behavior: "auto", block: "center" })
      } else if (scrollRef.current) {
        scrollRef.current.scrollIntoView({ behavior: "auto" })
      }
      setHasScrolledToUnread(true)
    }

    // Hide separator after 10 seconds of being in the room
    const timer = setTimeout(() => {
      setShowUnreadSeparator(false)
    }, 10000)

    return () => clearTimeout(timer)
  }, [roomId, firstUnreadIndex])

  useEffect(() => {
    // Scroll to bottom on new messages if already at bottom or if it's our message
    if (hasScrolledToUnread && scrollRef.current) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage?.sender.id === currentUser.id) {
        scrollRef.current.scrollIntoView({ behavior: "smooth" })
        // Also hide separator if we send a message
        setShowUnreadSeparator(false)
      }
    }
  }, [messages.length, isTyping, hasScrolledToUnread, currentUser.id])

  useEffect(() => {
    const fetchMessages = async () => {
      const result = await getMessages(roomId)
      if (result.messages) {
        const hasNewMessages = result.messages.length > messagesRef.current.length;
        const newMessages = result.messages.slice(messagesRef.current.length);
        const hasExternalNewMessages = newMessages.some(m => m.sender.id !== currentUser.id);

        if (JSON.stringify(result.messages) !== JSON.stringify(messagesRef.current)) {
          setMessages(result.messages);
        }

        if (hasNewMessages && hasExternalNewMessages) {
          await markAsRead(roomId);
          setCurrentLastReadAt(new Date().toISOString());
        }
      }
    }

    // Simulation for "typing" animation demonstration
    // Only if there are other participants in the room
    let typingInterval: NodeJS.Timeout | null = null;
    if (otherParticipantsCount > 0) {
      typingInterval = setInterval(() => {
        const now = new Date().getSeconds();
        if (now % 15 === 0) {
          setIsTyping(true);
          setTimeout(() => setIsTyping(false), 3000);
        }
      }, 1000);
    }

    // Initial fetch to ensure sync
    fetchMessages()

    // Poll every 3 seconds
    const interval = setInterval(fetchMessages, 3000)

    return () => {
      clearInterval(interval)
      if (typingInterval) clearInterval(typingInterval)
    }
  }, [roomId, otherParticipantsCount, currentUser.id])

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto px-3 py-4 md:px-6 md:py-8 space-y-4"
      >
        <div className="flex flex-col justify-end min-h-full">
          <AnimatePresence initial={false}>
            {messages.map((message, index) => {
              const isUnread = new Date(message.created_at) > new Date(currentLastReadAt) && message.sender.id !== currentUser.id
              const isFirstUnread = index === firstUnreadIndex

              return (
                <div key={message.id}>
                  <AnimatePresence mode="wait">
                    {isFirstUnread && showUnreadSeparator && (
                      <motion.div
                        key="unread-separator"
                        initial={{ opacity: 0, height: 0, scale: 0.9 }}
                        animate={{ opacity: 1, height: "auto", scale: 1 }}
                        exit={{ opacity: 0, height: 0, scale: 0.9 }}
                        className="flex items-center gap-4 my-6 overflow-hidden"
                        ref={unreadRef}
                      >
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-amber-500/50 to-amber-500" />
                        <span className="text-[10px] font-bold text-amber-600 uppercase tracking-[0.2em] bg-amber-50 px-3 py-1 rounded-full border border-amber-200/50 shadow-sm whitespace-nowrap">
                          {t('chat.newMessages')}
                        </span>
                        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-amber-500/50 to-amber-500" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "relative",
                      isUnread && "before:absolute before:-left-2 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-2/3 before:bg-amber-500 before:rounded-full before:shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                    )}
                  >
                    <MessageBubble
                      message={message}
                      isCurrentUser={message.sender.id === currentUser.id}
                    />
                  </motion.div>
                </div>
              )
            })}
          </AnimatePresence>

          {/* Typing Indicator - Only for other users */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex items-center gap-2 px-4 py-2 text-slate-400"
              >
                <div className="flex gap-1 items-center">
                  <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                    className="w-1.5 h-1.5 bg-slate-400 rounded-full"
                  />
                  <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                    className="w-1.5 h-1.5 bg-slate-400 rounded-full"
                  />
                  <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                    className="w-1.5 h-1.5 bg-slate-400 rounded-full"
                  />
                </div>
                <span className="text-xs font-medium italic">{t("chat.typing")}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={scrollRef} className="h-2" />
        </div>
      </div>
      <MessageInput
        roomId={roomId}
        userId={currentUser.id}
        userRole={userProfile?.role}
      />
    </div>
  )
}
