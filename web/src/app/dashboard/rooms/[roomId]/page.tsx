import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import prisma from "@/lib/db"
import { getSession } from "@/app/actions/auth"
import { ChatWindow } from "@/components/chat/chat-window"
import { RoomSettingsDialog } from "@/components/chat/room-settings-dialog"
import { ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import ru from "@/locales/ru.json"
import cnTrans from "@/locales/cn.json"
import { getInitialRoomMessages } from "@/lib/chat-utils"

interface RoomPageProps {
  params: Promise<{
    roomId: string
  }>
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { roomId } = await params
  const session = await getSession()

  if (!session?.user) redirect("/")

  const [user, room] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        full_name: true,
        avatar_url: true,
        role: true,
        // preferred_language: true // Temporarily disabled to prevent schema mismatch
      }
    }),
    prisma.room.findUnique({
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
  ])

  if (!user) redirect("/")
  if (!room) notFound()

  const lang = "ru" // Default to "ru" temporarily
  const translations = lang === "ru" ? ru : cnTrans

  // Fetch participation
  const participation = room.participants.find(p => p.user_id === user.id)
  if (!participation) {
    redirect("/dashboard")
  }

  const lastReadAt = participation.last_read_at

  // Determine display name for the room
    let displayName = room.name
    let displayAvatar = null
    let sharedRoomNames: string[] = []

    if (room.type === 'private') {
      const otherParticipant = room.participants.find(p => p.user_id !== user.id)
      if (otherParticipant) {
        displayName = otherParticipant.user.full_name || translations.room.interlocutor
        displayAvatar = otherParticipant.user.avatar_url
        
        // Fetch shared rooms
        try {
          const sharedRooms = await prisma.room.findMany({
            where: {
              type: 'group',
              AND: [
                { participants: { some: { user_id: user.id } } },
                { participants: { some: { user_id: otherParticipant.user_id } } }
              ]
            },
            select: { name: true },
            take: 3
          })
          sharedRoomNames = sharedRooms.map(r => r.name).filter(Boolean) as string[]
        } catch (error) {
          console.error("Failed to fetch shared rooms:", error)
        }
      }
    }

  const { messages, unreadCount, anchorId } = await getInitialRoomMessages(
    roomId, 
    user.id, 
    lastReadAt
  )

  return (
    <div 
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
                      {room.type === 'private' ? translations.room.private : translations.room.group}
                    </span>
                    <span className="text-[9px] md:text-xs text-slate-400 font-medium flex items-center gap-1 truncate max-w-[200px] md:max-w-[400px]">
                      <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                      <span className="truncate">
                        {room.type === 'private' 
                          ? (sharedRoomNames.length > 0 ? `${translations.room.sharedRooms}: ${sharedRoomNames.join(', ')}` : translations.room.online)
                          : `${room.participants.length} ${translations.room.participantsCount}`}
                      </span>
                    </span>
                  </div>
            </div>
        </div>
        <div className="flex items-center gap-1 md:gap-3 flex-shrink-0">
          <div className="h-6 md:h-8 w-[1px] bg-slate-200 mx-0.5 md:mx-1 hidden sm:block" />
          {room.type !== 'private' && (
            <RoomSettingsDialog 
              roomId={roomId} 
              currentUserRole={user.role} 
              roomName={displayName || "Chat"} 
            />
          )}
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-hidden relative flex">
        <div className="flex-1 overflow-hidden relative min-w-0">
          <ChatWindow 
            roomId={roomId} 
            initialMessages={messages} 
            currentUser={user}
            userProfile={user}
            initialUnreadCount={unreadCount}
            anchorId={anchorId}
            lastReadAt={lastReadAt?.toISOString() || new Date(0).toISOString()}
            participants={room.participants.map(p => ({
              id: p.user.id,
              full_name: p.user.full_name,
              avatar_url: p.user.avatar_url
            }))}
          />
        </div>
      </div>
    </div>
  )
}
