import Link from "next/link"
import { redirect } from "next/navigation"
import { getSession } from "@/app/actions/auth"
import { acceptRoomInviteForUser, validateRoomInvite } from "@/app/actions/room"

function humanizeInviteError(message: string) {
  switch (message) {
    case "Room not found":
      return "Комната не найдена"
    case "Invalid invite link":
      return "Недействительная ссылка-приглашение"
    case "Invite link has expired":
      return "Срок действия приглашения истёк"
    case "Invite link has reached maximum uses":
      return "Приглашение больше нельзя использовать"
    case "Room is full":
      return "В комнате достигнут лимит участников"
    default:
      return message
  }
}

function InviteErrorView({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0F172A] border border-white/10 rounded-[32px] p-8 shadow-2xl">
        <div className="space-y-3">
          <h1 className="text-xl font-bold text-white">Ошибка приглашения</h1>
          <p className="text-sm text-slate-400">{humanizeInviteError(message)}</p>
        </div>
        <div className="pt-6">
          <Link
            href="/"
            className="inline-flex w-full h-12 items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold border border-white/10 transition-all"
          >
            На главную
          </Link>
        </div>
      </div>
    </div>
  )
}

export default async function InvitePage({ params }: { params: Promise<{ roomId: string; token: string }> }) {
  const { roomId, token } = await params

  const validation = await validateRoomInvite(roomId, token)
  if ("error" in validation) {
    return <InviteErrorView message={validation.error} />
  }

  const session = await getSession()
  if (!session?.user) {
    redirect(
      `/?mode=register&inviteRoomId=${encodeURIComponent(roomId)}&inviteToken=${encodeURIComponent(token)}`
    )
  }

  const accepted = await acceptRoomInviteForUser({ userId: session.user.id, roomId, token })
  if ("error" in accepted) {
    return <InviteErrorView message={accepted.error} />
  }

  redirect(`/dashboard/rooms/${roomId}`)
}
