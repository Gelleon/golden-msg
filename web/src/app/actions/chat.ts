"use server"

import prisma from "@/lib/db"
import { openai } from "@/lib/openai"
import { getSession } from "./auth"
import { revalidatePath } from "next/cache"
import fs from "fs/promises"
import path from "path"

export async function deleteMessage(messageId: string) {
  const session = await getSession()
  if (!session?.user) return { error: "Unauthorized" }

  try {
    const message = await prisma.message.findUnique({
      where: { id: messageId },
      include: { room: true }
    })

    if (!message) return { error: "Message not found" }

    // Only sender or admin can delete
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (message.sender_id !== session.user.id && user?.role !== "admin") {
      return { error: "Permission denied" }
    }

    // Delete file from server if it exists
    if (message.file_url && message.file_url.startsWith("/uploads/")) {
      try {
        const filePath = path.join(process.cwd(), "public", message.file_url)
        await fs.unlink(filePath)
        console.log(`File deleted: ${filePath}`)
      } catch (fileError) {
        console.error("Error deleting file from server:", fileError)
        // Continue even if file deletion fails (maybe it was already deleted)
      }
    }

    await prisma.message.delete({
      where: { id: messageId }
    })

    revalidatePath(`/dashboard/rooms/${message.room_id}`)
    return { success: true }
  } catch (error) {
    console.error("Delete message error:", error)
    return { error: "Failed to delete message" }
  }
}

export async function getMessages(roomId: string) {
  const session = await getSession()
  if (!session?.user) return { error: "Unauthorized" }

  // Verify user is a participant of the room
  const participation = await prisma.roomParticipant.findUnique({
    where: {
      room_id_user_id: {
        room_id: roomId,
        user_id: session.user.id,
      },
    },
  })

  if (!participation) {
    return { error: "You are not a member of this room" }
  }

  const messages = await prisma.message.findMany({
    where: {
      room_id: roomId,
    },
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
    orderBy: {
      created_at: "asc",
    },
  })

  // Map to frontend structure
  const formattedMessages = messages.map((msg) => ({
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

  return { messages: formattedMessages }
}

export async function sendMessageAction({
  roomId,
  content,
  messageType,
  fileUrl,
}: {
  roomId: string
  content: string
  messageType: "text" | "voice" | "file"
  fileUrl?: string
}) {
  const session = await getSession()
  if (!session?.user) return { error: "Unauthorized" }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (!user) {
    return { error: "User not found" }
  }

  const languageOriginal = user.preferred_language || "ru"
  const targetLanguage = languageOriginal === "ru" ? "Chinese" : "Russian"

  let contentTranslated: string | null = null
  let voiceTranscription: string | null = null

  // AI Processing
  try {
    if (openai) {
      if (messageType === "text") {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are a professional translator. Translate the following text from ${
                languageOriginal === "ru" ? "Russian" : "Chinese"
              } to ${targetLanguage}. Return only the translated text.`,
            },
            {
              role: "user",
              content: content,
            },
          ],
        })
        contentTranslated = completion.choices[0].message.content
      } else if (messageType === "voice" && fileUrl) {
        // Fetch the audio file
        let file: any; // Type 'any' to accommodate both File and ReadStream

        if (fileUrl.startsWith("/uploads/")) {
             // Local file
             const fs = await import("fs")
             const path = await import("path")
             // Remove leading slash to ensure path.join works correctly on all OS
             const relativePath = fileUrl.startsWith("/") ? fileUrl.slice(1) : fileUrl
             const filePath = path.join(process.cwd(), "public", relativePath)
             file = fs.createReadStream(filePath)
        } else {
            const response = await fetch(fileUrl)
            if (!response.ok) throw new Error("Failed to fetch audio file")
            
            const blob = await response.blob()
            
            // Convert Blob to File-like object for OpenAI
            file = new File([blob], "voice.webm", { type: "audio/webm" })
        }

        const transcription = await openai.audio.transcriptions.create({
          file: file,
          model: "whisper-1",
          language: languageOriginal === "ru" ? "ru" : "zh", // Hint language
        })
        
        voiceTranscription = transcription.text
        
        // Translate the transcription
        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are a professional translator. Translate the following text from ${
                languageOriginal === "ru" ? "Russian" : "Chinese"
              } to ${targetLanguage}. Return only the translated text.`,
            },
            {
              role: "user",
              content: voiceTranscription,
            },
          ],
        })
        contentTranslated = completion.choices[0].message.content
      }
    } else {
      // Mock AI if no API key
      if (messageType === "text") {
        contentTranslated = `[AI Translated to ${targetLanguage}]: ${content}`
      } else if (messageType === "voice") {
        voiceTranscription = "This is a simulated voice transcription."
        contentTranslated = `[AI Translated]: ${voiceTranscription}`
      }
    }
  } catch (error) {
    console.error("AI Processing Error:", error)
    // Fallback if AI fails
    contentTranslated = null
  }

  // Insert Message into Database
  try {
    const message = await prisma.message.create({
      data: {
        room_id: roomId,
        sender_id: user.id,
        content: content, // Prisma schema uses `content`, not `content_original`
        content_translated: contentTranslated,
        message_type: messageType,
        file_url: fileUrl,
        voice_transcription: voiceTranscription,
      },
      include: {
        sender: {
          select: {
            id: true,
            full_name: true,
            avatar_url: true,
            role: true,
          },
        },
      },
    })

    revalidatePath(`/dashboard/rooms/${roomId}`)
    return { 
      success: true, 
      message: {
        ...message,
        created_at: message.created_at.toISOString()
      } 
    }
  } catch (error) {
    console.error("Database Error:", error)
    return { error: "Failed to send message" }
  }
}
