import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import prisma from "@/lib/db"
import { getSession } from "@/app/actions/auth"
import { ChatWindow } from "@/components/chat/chat-window"
import { RoomSettingsDialog } from "@/components/chat/room-settings-dialog"
import { ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import * as motion from "framer-motion/client"

interface RoomPageProps {
  params: Promise<{
    roomId: string
  }>
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { roomId } = await params
  const session = await getSession()

  if (!session?.user) redirect("/")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (!user) redirect("/")

  // Check room access and get details
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: {
      participants: {
        include: {
          user: {
            select: {
              id: true,
              full_name: true,
              avatar_url: true
            }
          }
        }
      }
    }
  })

  if (!room) {
    notFound()
  }

  // Check participation
  const isParticipant = room.participants.some(p => p.user_id === user.id)
  if (!isParticipant) {
    redirect("/dashboard")
  }

  // Determine display name for the room
  let displayName = room.name
  let displayAvatar = null
  
  if (room.type === 'private') {
    const otherParticipant = room.participants.find(p => p.user_id !== user.id)
    if (otherParticipant) {
      displayName = otherParticipant.user.full_name || "Собеседник"
      displayAvatar = otherParticipant.user.avatar_url
    }
  }

  // Fetch initial messages
  const rawMessages = await prisma.message.findMany({
    where: { room_id: roomId },
    include: {
      sender: {
        select: {
          id: true,
          full_name: true,
          avatar_url: true,
          role: true,
          preferred_language: true,
        },
      },
    },
    orderBy: { created_at: "asc" },
  })

  const messages = rawMessages.map((msg) => ({
    id: msg.id,
    content_original: msg.content,
    content_translated: msg.content_translated,
    language_original: msg.sender.preferred_language || "ru",
    message_type: msg.message_type,
    file_url: msg.file_url,
    voice_transcription: msg.voice_transcription,
    created_at: msg.created_at.toISOString(),
    sender: {
      id: msg.sender.id,
      full_name: msg.sender.full_name,
      avatar_url: msg.sender.avatar_url,
      role: msg.sender.role,
    },
  }))

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col bg-[#F8FAFC]"
    >
      <div className="h-[64px] md:h-[72px] border-b border-slate-200/60 bg-white/90 backdrop-blur-xl flex justify-between items-center px-3 md:px-6 sticky top-0 z-20 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
            <Link href="/dashboard" className="md:hidden p-2 -ml-1 text-slate-500 hover:text-slate-900 transition-colors">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <div className="relative group flex-shrink-0">
              {displayAvatar ? (
                  <div className="h-9 w-9 md:h-12 md:w-12 rounded-xl md:rounded-2xl overflow-hidden border-2 border-slate-100 shadow-sm transition-transform group-hover:scale-105">
                      <img src={displayAvatar} alt={displayName || "Avatar"} className="h-full w-full object-cover" />
                  </div>
              ) : (
                <div className="h-9 w-9 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-base md:text-xl shadow-md transition-transform group-hover:scale-105">
                  {displayName?.charAt(0).toUpperCase()}
                </div>
              )}
              {room.type === 'private' && (
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 md:w-4 md:h-4 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
              )}
            </div>
            <div className="flex flex-col min-w-0">
                <h2 className="font-bold text-slate-900 text-sm md:text-lg leading-tight tracking-tight truncate pr-2">{displayName}</h2>
                <div className="flex items-center gap-1.5 md:gap-2 mt-0.5">
                  <span className={cn(
                    "inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] md:text-[10px] font-bold uppercase tracking-wider",
                    room.type === 'private' ? "bg-blue-50 text-blue-600" : "bg-indigo-50 text-indigo-600"
                  )}>
                    {room.type === 'private' ? 'Личный' : 'Группа'}
                  </span>
                  <span className="text-[9px] md:text-xs text-slate-400 font-medium flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    {room.type === 'private' ? 'В сети' : `${room.participants.length} уч.`}
                  </span>
                </div>
            </div>
        </div>
        <div className="flex items-center gap-1 md:gap-3 flex-shrink-0">
          <div className="h-6 md:h-8 w-[1px] bg-slate-200 mx-0.5 md:mx-1 hidden sm:block" />
          <RoomSettingsDialog 
            roomId={roomId} 
            currentUserRole={user.role} 
            roomName={displayName || "Chat"} 
          />
        </div>
      </div>
      <div className="flex-1 overflow-hidden relative">
        <ChatWindow 
          roomId={roomId} 
          initialMessages={messages} 
          currentUser={user}
          userProfile={user}
        />
      </div>
    </motion.div>
  )
}
