"use client"

import { useEffect, useRef, useState } from "react"
import { getMessages } from "@/app/actions/chat"

import { MessageBubble } from "@/components/chat/message-bubble"
import { MessageInput } from "@/components/chat/message-input"
import { motion, AnimatePresence } from "framer-motion"

interface ChatWindowProps {
  roomId: string
  initialMessages: any[]
  currentUser: any
  userProfile: any
}

export function ChatWindow({
  roomId,
  initialMessages,
  currentUser,
  userProfile,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<any[]>(initialMessages)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Scroll to bottom on mount and new messages
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages.length]) // Only scroll when message count changes to avoid jumping on edits

  useEffect(() => {
    const fetchMessages = async () => {
      const result = await getMessages(roomId)
      if (result.messages) {
        setMessages((prev) => {
          // Simple optimization to avoid unnecessary re-renders
          if (JSON.stringify(result.messages) !== JSON.stringify(prev)) {
            return result.messages
          }
          return prev
        })
      }
    }

    // Initial fetch to ensure sync
    fetchMessages()

    // Poll every 3 seconds
    const interval = setInterval(fetchMessages, 3000)

    return () => clearInterval(interval)
  }, [roomId])

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <div className="flex-1 overflow-y-auto px-3 py-4 md:px-6 md:py-8 space-y-4">
        <div className="flex flex-col justify-end min-h-full">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <MessageBubble
                  message={message}
                  isCurrentUser={message.sender.id === currentUser.id}
                />
              </motion.div>
            ))}
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
