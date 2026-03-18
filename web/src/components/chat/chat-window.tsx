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
  initialUnreadCount?: number
  anchorId?: string | null
}

export function ChatWindow({
  roomId,
  initialMessages,
  currentUser,
  userProfile,
  lastReadAt,
  participants = [],
  initialUnreadCount = 0,
  anchorId = null,
}: ChatWindowProps) {
  const { t } = useTranslation()
  const [messages, setMessages] = useState<any[]>(initialMessages)
  const [isTyping, setIsTyping] = useState(false)
  const [typingUserNames, setTypingUserNames] = useState<string[]>([])
  const [hasScrolledToUnread, setHasScrolledToUnread] = useState(false)
  const [showUnreadSeparator, setShowUnreadSeparator] = useState(true)
  const [currentLastReadAt, setCurrentLastReadAt] = useState(lastReadAt)
  const [replyTo, setReplyTo] = useState<any>(null)
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount)
  const [isLoadingOlder, setIsLoadingOlder] = useState(false)
  const [hasMoreOlder, setHasMoreOlder] = useState(true)
  
  const scrollRef = useRef<HTMLDivElement>(null)
  const unreadRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const topRef = useRef<HTMLDivElement>(null)
  const isAtBottomRef = useRef(true)
  const isAutoScrollingRef = useRef(false)
  const autoScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const otherParticipantsCount = participants.filter(p => p.id !== currentUser.id).length
  const messagesRef = useRef(messages)
  const isMountedRef = useRef(false)

  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  // Find the first unread message index (only once on load)
  const [firstUnreadIndex] = useState(() => {
    if (anchorId) {
      return messages.findIndex(m => m.id === anchorId)
    }
    return messages.findIndex(m => 
      new Date(m.created_at) > new Date(lastReadAt) && m.sender.id !== currentUser.id
    )
  })

  // Handle scrolling and mark as read
  const handleScroll = async () => {
    if (!containerRef.current) return
    
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 150
    
    if (!isAutoScrollingRef.current) {
      isAtBottomRef.current = isAtBottom
    }

    const isAtTop = scrollTop < 50

    if (isAtBottom && unreadCount > 0) {
      setUnreadCount(0)
      await markAsRead(roomId)
      setCurrentLastReadAt(new Date().toISOString())
    }

    if (isAtTop && !isLoadingOlder && hasMoreOlder && messages.length > 0) {
      loadOlderMessages()
    }
  }

  const loadOlderMessages = async () => {
    setIsLoadingOlder(true)
    const firstMsgId = messages[0]?.id
    try {
      if (firstMsgId) {
        const result = await getMessages(roomId, { cursorId: firstMsgId, direction: 'older', limit: 20 })
        if (result.messages && Array.isArray(result.messages) && result.messages.length > 0) {
          // Keep scroll position
          const container = containerRef.current
          const previousScrollHeight = container ? container.scrollHeight : 0
          
          setMessages(prev => [...result.messages, ...prev])
          
          // Restore scroll position
          requestAnimationFrame(() => {
            if (container) {
              container.scrollTop = container.scrollHeight - previousScrollHeight
            }
          })
        } else {
          setHasMoreOlder(false)
        }
      }
    } catch (error) {
      console.error("Failed to load older messages", error)
    } finally {
      setIsLoadingOlder(false)
    }
  }

  const scrollToBottom = (behavior: "smooth" | "auto" = "smooth") => {
    if (containerRef.current) {
      isAutoScrollingRef.current = true;
      
      if (autoScrollTimeoutRef.current) {
        clearTimeout(autoScrollTimeoutRef.current);
      }

      // Allow DOM to update and framer-motion to measure before scrolling
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollIntoView({ behavior, block: "end" });
        } else if (containerRef.current) {
          containerRef.current.scrollTo({
            top: containerRef.current.scrollHeight,
            behavior
          });
        }
        
        setUnreadCount(0);
        markAsRead(roomId);
        setCurrentLastReadAt(new Date().toISOString());

        // Reset auto-scrolling flag after animation completes
        autoScrollTimeoutRef.current = setTimeout(() => {
          isAutoScrollingRef.current = false;
          // After a forced scroll to bottom, we are at the bottom
          isAtBottomRef.current = true;
        }, behavior === "smooth" ? 800 : 100);
      }, 50);
    }
  }

  useEffect(() => {
    // Scroll to first unread or bottom
    if (!hasScrolledToUnread) {
      const performInitialScroll = () => {
        if (firstUnreadIndex !== -1 && unreadRef.current) {
          unreadRef.current.scrollIntoView({ behavior: "auto", block: "center" })
        } else if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight
          isAtBottomRef.current = true
          if (unreadCount > 0) {
            setUnreadCount(0)
            markAsRead(roomId)
            setCurrentLastReadAt(new Date().toISOString())
          }
        }
      }

      // Execute immediately and also after a short delay to account for any layout shifts
      // caused by images or framer-motion animations rendering
      performInitialScroll()
      setTimeout(performInitialScroll, 300)
      setTimeout(performInitialScroll, 800)
      setTimeout(performInitialScroll, 1500)

      setHasScrolledToUnread(true)
    }

    // Hide separator after 10 seconds of being in the room
    const timer = setTimeout(() => {
      setShowUnreadSeparator(false)
    }, 10000)

    return () => clearTimeout(timer)
  }, [roomId, firstUnreadIndex, unreadCount])

  const prevMessagesLength = useRef(messages.length)

  useEffect(() => {
    // Scroll to bottom on new messages if already at bottom or if it's our message
    if (hasScrolledToUnread && containerRef.current) {
      const lastMessage = messages[messages.length - 1]
      const isNewMessage = messages.length > prevMessagesLength.current
      const isMyMessage = lastMessage?.sender.id === currentUser.id

      if (isNewMessage) {
        if (isMyMessage || isAtBottomRef.current) {
          scrollToBottom("smooth")
          if (isMyMessage) {
            setShowUnreadSeparator(false)
          }
        }
      } else if (isAtBottomRef.current && messages.length > 0) {
        // If message content changed (e.g. translation arrived) or typing state changed
        // and we are at the bottom, stick to the bottom so the layout shift doesn't push the user up.
        scrollToBottom("auto")
      }
      
      prevMessagesLength.current = messages.length
    }
  }, [messages.length, messages[messages.length - 1]?.id, isTyping, hasScrolledToUnread, currentUser.id])

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const lastMsgId = messagesRef.current.length > 0 ? messagesRef.current[messagesRef.current.length - 1].id : undefined;
        
        // Fetch only new messages if we have messages, otherwise fetch recent
        const options = lastMsgId ? { cursorId: lastMsgId, direction: 'newer' as const } : { limit: 30 };
        
        const result = await getMessages(roomId, options)
        if (!isMountedRef.current) return
        
        if (result.messages && Array.isArray(result.messages) && result.messages.length > 0) {
          const newMessages = result.messages;
          const hasExternalNewMessages = newMessages.some(m => m.sender.id !== currentUser.id);

          setMessages(prev => {
            // Ensure we don't duplicate messages
            const existingIds = new Set(prev.map(m => m.id));
            const uniqueNew = newMessages.filter(m => !existingIds.has(m.id));
            return [...prev, ...uniqueNew];
          });

          setIsTyping(result.isTyping || false)
          setTypingUserNames(result.typingUserNames || [])

          if (hasExternalNewMessages) {
            // Only auto-read if we are at the bottom
            const container = containerRef.current;
            if (container) {
              const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
              if (isAtBottom) {
                await markAsRead(roomId);
                setCurrentLastReadAt(new Date().toISOString());
              } else {
                setUnreadCount(prev => prev + newMessages.filter(m => m.sender.id !== currentUser.id).length);
              }
            }
          }
        } else if (result.isTyping !== undefined) {
          setIsTyping(result.isTyping || false)
          setTypingUserNames(result.typingUserNames || [])
        }
      } catch (error) {
        console.error("Error fetching messages:", error)
      }
    }

    // Initial fetch to ensure sync
    fetchMessages()

    // SSE Connection
    const sse = new EventSource(`/api/sse?roomId=${roomId}`);

    sse.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'message_update') {
           const { messageId, payload } = data;
           setMessages(prev => prev.map(msg => {
             if (msg.id === messageId) {
               return { ...msg, ...payload };
             }
             return msg;
           }));
        } else if (data.type === 'new_message') {
           // Handle new message if SSE sends full message (optional, currently we poll/fetch)
           // But user asked for real-time updates.
           // If I rely on polling for new messages, it might be slow (3s).
           // Ideally, sendMessageAction adds it to state immediately (optimistic), 
           // and SSE updates the translation.
           // For messages from others, polling is okay-ish, but SSE is better.
           // For now, let's stick to polling for new messages + SSE for updates.
           // Or I can trigger a fetchMessages() on 'new_message' event if I implement it.
        }
      } catch (e) {
        console.error("SSE Parse Error", e);
      }
    };

    sse.onerror = (e: any) => {
      if (sse.readyState === EventSource.CONNECTING) {
        console.log("[SSE] Reconnecting...");
      } else if (sse.readyState === EventSource.CLOSED) {
        console.log("[SSE] Connection closed.");
      } else {
        console.error("[SSE] Error:", e);
      }
      // EventSource will automatically attempt to reconnect
    };

    // Poll every 3 seconds
    const interval = setInterval(fetchMessages, 3000)

    return () => {
      clearInterval(interval)
      sse.close();
    }
  }, [roomId, otherParticipantsCount, currentUser.id])

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      {/* Unread Banner */}
      <AnimatePresence>
        {unreadCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-10"
          >
            <button
              onClick={() => scrollToBottom()}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg transition-colors text-sm font-medium"
            >
              <span>{unreadCount} {t("chat.newMessages") || "новых сообщений"}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-3 py-4 md:px-6 md:py-8 space-y-4 relative"
      >
        <div className="flex flex-col justify-end min-h-full">
          {isLoadingOlder && (
            <div className="flex justify-center py-2">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <AnimatePresence initial={false}>
            {messages.map((message, index) => {
              const isUnread = new Date(message.created_at) > new Date(currentLastReadAt) && message.sender.id !== currentUser.id
              const isFirstUnread = index === firstUnreadIndex
              
              // Telegram style: show name if it's the first message from this sender in a row
              const prevMessage = index > 0 ? messages[index - 1] : null
              const isSameSenderAsPrev = prevMessage?.sender.id === message.sender.id
              const timeDiff = prevMessage 
                ? (new Date(message.created_at).getTime() - new Date(prevMessage.created_at).getTime()) / (1000 * 60)
                : 0
              const showSenderName = (participants.length > 2) && (!isSameSenderAsPrev || timeDiff > 5)

              // Telegram style: show avatar if it's the last message from this sender in a row
              const nextMessage = index < messages.length - 1 ? messages[index + 1] : null
              const isSameSenderAsNext = nextMessage?.sender.id === message.sender.id
              const showAvatar = !isSameSenderAsNext || (nextMessage && (new Date(nextMessage.created_at).getTime() - new Date(message.created_at).getTime()) / (1000 * 60) > 5)

              return (
                <motion.div 
                  key={message.id}
                  layout="position"
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
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
                  <div
                    id={`message-${message.id}`}
                    className={cn(
                      "relative transition-colors duration-500 rounded-xl",
                      isUnread && "before:absolute before:-left-2 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-2/3 before:bg-amber-500 before:rounded-full before:shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                    )}
                  >
                    <MessageBubble
                      message={message}
                      isCurrentUser={message.sender.id === currentUser.id}
                      onReply={(msg) => setReplyTo(msg)}
                      showSenderName={showSenderName}
                      showAvatar={showAvatar}
                    />
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {/* Typing Indicator - Real-time */}
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
                    className="w-1.5 h-1.5 bg-amber-500 rounded-full"
                  />
                  <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                    className="w-1.5 h-1.5 bg-amber-500 rounded-full"
                  />
                  <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                    className="w-1.5 h-1.5 bg-amber-500 rounded-full"
                  />
                </div>
                <span className="text-xs font-medium italic">
                  {typingUserNames.length > 1 
                    ? `${typingUserNames.join(", ")} ${t("chat.typing_multiple") || "печатают..."}`
                    : `${typingUserNames[0]} ${t("chat.typing") || "печатает..."}`}
                </span>
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
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
        onMessageSent={async () => {
          const lastMsgId = messagesRef.current.length > 0 ? messagesRef.current[messagesRef.current.length - 1].id : undefined;
          const options = lastMsgId ? { cursorId: lastMsgId, direction: 'newer' as const } : { limit: 30 };
          const result = await getMessages(roomId, options);
          
          if (result.messages && result.messages.length > 0) {
            setMessages(prev => {
              const existingIds = new Set(prev.map(m => m.id));
              const uniqueNew = result.messages.filter(m => !existingIds.has(m.id));
              return [...prev, ...uniqueNew];
            });
            scrollToBottom("smooth");
          }
        }}
      />
    </div>
  )
}
