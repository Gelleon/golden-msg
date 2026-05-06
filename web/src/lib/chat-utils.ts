import prisma from "@/lib/db"
import { after } from "next/server"
import { translationQueue } from "@/lib/translation-queue"
import { processAsyncMessage } from "@/app/actions/chat"

export const messageSelect = {
  id: true,
  content: true,
  content_translated: true,
  language_original: true,
  message_type: true,
  file_url: true,
  voice_transcription: true,
  created_at: true,
  is_edited: true,
  translation_status: true,
  translation_error: true,
  sender: {
    select: {
      id: true,
      full_name: true,
      avatar_url: true,
      role: true,
    },
  },
  reply_to: {
    select: {
      id: true,
      content: true,
      sender: {
        select: {
          id: true,
          full_name: true,
        }
      }
    }
  }
}

function runAfterRequestScope(fn: () => Promise<void>) {
  try {
    after(fn)
  } catch {
    fn().catch(() => {})
  }
}

export async function getInitialRoomMessages(roomId: string, userId: string, lastReadAt: Date | null | undefined) {
  // Calculate unread count
  const unreadCount = await prisma.message.count({
    where: {
      room_id: roomId,
      created_at: { gt: lastReadAt || new Date(0) },
      sender_id: { not: userId }
    }
  })

  let rawMessages = []
  let anchorId: string | null = null

  if (unreadCount > 0) {
    // Find the first unread message
    const firstUnread = await prisma.message.findFirst({
      where: {
        room_id: roomId,
        created_at: { gt: lastReadAt || new Date(0) },
        sender_id: { not: userId }
      },
      orderBy: { created_at: "asc" },
      select: { id: true, created_at: true }
    })

    if (firstUnread) {
      anchorId = firstUnread.id
      
      // Load 10 messages before the first unread
      const olderMessages = await prisma.message.findMany({
        where: { room_id: roomId, created_at: { lt: firstUnread.created_at } },
        orderBy: { created_at: "desc" },
        take: 10,
        select: messageSelect
      })

      // Load first unread + 20 newer messages
      const newerMessages = await prisma.message.findMany({
        where: { room_id: roomId, created_at: { gte: firstUnread.created_at } },
        orderBy: { created_at: "asc" },
        take: 20,
        select: messageSelect
      })

      rawMessages = [...olderMessages.reverse(), ...newerMessages]
    } else {
      // Fallback
      const latestMessages = await prisma.message.findMany({
        where: { room_id: roomId },
        orderBy: { created_at: "desc" },
        take: 30,
        select: messageSelect
      })
      rawMessages = latestMessages.reverse()
    }
  } else {
    // No unread messages, load the latest 30
    const latestMessages = await prisma.message.findMany({
      where: { room_id: roomId },
      orderBy: { created_at: "desc" },
      take: 30,
      select: messageSelect
    })
    rawMessages = latestMessages.reverse()
  }

  const messagesNeedingAutoTranslation = rawMessages
    .filter((msg) => msg.message_type === "text")
    .filter((msg) => !msg.content_translated)
    .filter((msg) => (msg.translation_status ?? "none") === "none")
    .filter((msg) => (msg.content ?? "").trim().length > 0)
  const autoTranslateIds = new Set(messagesNeedingAutoTranslation.map((m) => m.id))

  if (messagesNeedingAutoTranslation.length > 0) {
    runAfterRequestScope(async () => {
      await Promise.all(
        messagesNeedingAutoTranslation.map(async (msg) => {
          await prisma.message.update({
            where: { id: msg.id },
            data: {
              translation_status: "pending",
              translation_error: null,
            },
            select: { id: true },
          })
        })
      )

      for (const msg of messagesNeedingAutoTranslation) {
        const languageOriginal = msg.language_original === "cn" ? "Chinese" : "Russian"
        const targetLanguage = languageOriginal === "Russian" ? "Chinese" : "Russian"
        const content = msg.content ?? ""

        translationQueue
          .add(async () => {
            await processAsyncMessage(
              msg.id,
              roomId,
              content,
              "text",
              null,
              languageOriginal,
              targetLanguage
            )
          })
          .catch(() => {})
      }
    })
  }

  const messages = rawMessages.map((msg) => ({
    id: msg.id,
    content_original: msg.content,
    content_translated: msg.content_translated,
    language_original: msg.language_original || "ru",
    message_type: msg.message_type,
    file_url: msg.file_url,
    voice_transcription: msg.voice_transcription,
    created_at: msg.created_at.toISOString(),
    is_edited: msg.is_edited,
    translation_status: autoTranslateIds.has(msg.id) ? "pending" : msg.translation_status,
    reply_to: msg.reply_to ? {
      id: msg.reply_to.id,
      content: msg.reply_to.content,
      sender_name: msg.reply_to.sender.full_name,
    } : null,
    sender: {
      id: msg.sender.id,
      full_name: msg.sender.full_name,
      avatar_url: msg.sender.avatar_url,
      role: msg.sender.role,
    },
  }))

  return {
    messages,
    unreadCount,
    anchorId
  }
}
