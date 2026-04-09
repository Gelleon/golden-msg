import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getSession } from "@/app/actions/auth"
import { ensureSchemaFixed } from "@/lib/schema-fix"

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

  try {
    await ensureSchemaFixed()

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      select: { id: true, created_by: true, type: true },
    })

    const participants = await prisma.roomParticipant.findMany({
      where: { room_id: roomId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            full_name: true,
            avatar_url: true,
            role: true,
            last_active_at: true,
          },
        },
      },
      orderBy: { joined_at: "asc" },
    })

    return NextResponse.json({
      ok: true,
      input: { roomId },
      session: {
        user: session?.user ? { id: session.user.id, role: session.user.role } : null,
      },
      room,
      participants: {
        count: participants.length,
        sample: participants.slice(0, 3).map((p) => ({
          user_id: p.user_id,
          joined_at: p.joined_at,
          role: p.role,
          user: p.user,
        })),
      },
    })
  } catch (e: any) {
    return NextResponse.json(
      {
        ok: false,
        input: { roomId },
        session: {
          user: session?.user ? { id: session.user.id, role: session.user.role } : null,
        },
        error: {
          name: e?.name || null,
          message: e?.message || String(e),
          stack: e?.stack || null,
        },
      },
      { status: 500 }
    )
  }
}

