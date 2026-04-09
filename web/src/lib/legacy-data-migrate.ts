import crypto from "crypto"
import prisma from "./db"

type SqlRow = Record<string, any>

async function tableExists(name: string) {
  const rows = await prisma.$queryRawUnsafe<SqlRow[]>(
    `SELECT name FROM sqlite_master WHERE type='table' AND name = ?`,
    name
  )
  return rows.length > 0
}

async function getCount(table: string) {
  try {
    const rows = await prisma.$queryRawUnsafe<SqlRow[]>(`SELECT COUNT(*) as c FROM "${table}"`)
    const c = rows?.[0]?.c
    return typeof c === "bigint" ? Number(c) : Number(c ?? 0)
  } catch {
    return 0
  }
}

function toDate(value: any) {
  if (!value) return new Date()
  if (value instanceof Date) return value
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? new Date() : d
}

export async function ensureLegacyDataMigrated() {
  const userCount = await getCount("User")
  const roomCount = await getCount("Room")
  const participantCount = await getCount("RoomParticipant")
  const messageCount = await getCount("Message")

  const profilesExists = await tableExists("profiles")
  const usersExists = await tableExists("users")
  const roomsExists = await tableExists("rooms")
  const roomParticipantsExists = await tableExists("room_participants")
  const messagesExists = await tableExists("messages")

  const hasLegacyUsers = profilesExists || usersExists
  const hasLegacyRooms = roomsExists
  const hasLegacyParticipants = roomParticipantsExists
  const hasLegacyMessages = messagesExists

  if (!hasLegacyUsers && !hasLegacyRooms && !hasLegacyParticipants && !hasLegacyMessages) return
  if (userCount > 0 || roomCount > 0 || participantCount > 0 || messageCount > 0) return

  const legacyUserTable = profilesExists ? "profiles" : (usersExists ? "users" : null)
  if (!legacyUserTable) return

  const legacyUsers = await prisma.$queryRawUnsafe<SqlRow[]>(`SELECT * FROM "${legacyUserTable}"`)
  if (!legacyUsers || legacyUsers.length === 0) return

  const legacyRooms = roomsExists ? await prisma.$queryRawUnsafe<SqlRow[]>(`SELECT * FROM "rooms"`) : []
  const legacyParticipants = roomParticipantsExists ? await prisma.$queryRawUnsafe<SqlRow[]>(`SELECT * FROM "room_participants"`) : []
  const legacyMessages = messagesExists ? await prisma.$queryRawUnsafe<SqlRow[]>(`SELECT * FROM "messages"`) : []

  await prisma.$transaction(async (tx) => {
    await tx.user.createMany({
      data: legacyUsers
        .filter((u) => u?.id && u?.email)
        .map((u) => ({
        id: String(u.id),
        email: String(u.email),
        full_name: u.full_name ?? null,
        avatar_url: u.avatar_url ?? null,
        role: String(u.role ?? "partner"),
        preferred_language: String(u.preferred_language ?? "ru"),
        password_hash: String(u.password_hash ?? ""),
        created_at: toDate(u.created_at),
        last_active_at: toDate(u.last_active_at ?? u.created_at),
        email_notifications_enabled: true,
        push_notifications_enabled: true,
        last_email_notification_at: null,
        last_push_notification_at: null,
        last_password_reset_at: null,
      })),
    })

    await tx.room.createMany({
      data: legacyRooms.map((r) => ({
        id: String(r.id),
        name: r.name ?? null,
        description: r.description ?? null,
        capacity: r.capacity ?? 0,
        equipment: r.equipment ?? null,
        type: String(
          r.type ?? (r.is_direct_message ? "private" : "group")
        ),
        created_by: r.created_by ? String(r.created_by) : null,
        created_at: toDate(r.created_at),
        updated_at: toDate(r.updated_at ?? r.created_at),
        room_id: r.room_id ? String(r.room_id) : null,
      })),
    })

    await tx.roomParticipant.createMany({
      data: legacyParticipants.map((p) => ({
        id: crypto.randomUUID(),
        room_id: String(p.room_id),
        user_id: String(p.user_id),
        role: String(p.role ?? "member"),
        joined_at: toDate(p.joined_at),
        last_read_at: toDate(p.last_read_at ?? p.joined_at),
        last_active_at: toDate(p.last_active_at ?? p.joined_at),
        typing_at: p.typing_at ? toDate(p.typing_at) : null,
      })),
    })

    await tx.message.createMany({
      data: legacyMessages.map((m) => ({
        id: String(m.id),
        room_id: String(m.room_id),
        sender_id: String(m.sender_id),
        content: m.content ?? m.content_original ?? null,
        content_translated: m.content_translated ?? null,
        language_original: String(m.language_original ?? "ru"),
        message_type: String(m.message_type ?? "text"),
        file_url: m.file_url ?? null,
        voice_transcription: m.voice_transcription ?? null,
        created_at: toDate(m.created_at),
        is_edited: Boolean(m.is_edited ?? false),
        reply_to_id: m.reply_to_id ? String(m.reply_to_id) : null,
        translation_status: String(m.translation_status ?? "completed"),
        translation_error: m.translation_error ?? null,
        is_pinned: Boolean(m.is_pinned ?? false),
        is_important: Boolean(m.is_important ?? false),
      })),
    })
  })
}
