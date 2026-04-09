import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getSession } from "@/app/actions/auth"

export async function GET(req: NextRequest) {
  const session = await getSession()
  const isAdmin = session?.user?.role === "admin"

  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const roomId = searchParams.get("roomId")
  if (!roomId) {
    return NextResponse.json({ error: "Missing roomId" }, { status: 400 })
  }

  const room = await prisma.room.findUnique({
    where: { id: roomId },
    select: { id: true, created_by: true, type: true },
  })

  const membership = session?.user?.id
    ? await prisma.roomParticipant.findUnique({
        where: { room_id_user_id: { room_id: roomId, user_id: session.user.id } },
        select: { user_id: true },
      })
    : null

  const isAdminOrManager = ["admin", "manager"].includes(session?.user?.role || "")
  const isCreator = Boolean(room?.created_by && room.created_by === session?.user?.id)
  const isMember = Boolean(membership)

  return NextResponse.json({
    ok: true,
    input: { roomId },
    session: {
      user: session?.user ? { id: session.user.id, role: session.user.role } : null,
    },
    room,
    membership: { exists: isMember },
    access: {
      isAdminOrManager,
      isCreator,
      isMember,
      canAccess: Boolean(room && (isAdminOrManager || isCreator || isMember)),
    },
  })
}

