"use server"

import prisma from "@/lib/db"
import { openai } from "@/lib/openai"
import { getSession } from "./auth"
import { revalidatePath } from "next/cache"
import fs from "fs/promises"
import path from "path"
import { translateText } from "@/lib/dewiar"

async function translateWithDewiar(text: string, fromLang: string, toLang: string) {
  try {
    const translation = await translateText(text, fromLang, toLang);
    
    if (translation) {
      return translation;
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

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

export async function updateMessage(messageId: string, content: string) {
  const session = await getSession()
  if (!session?.user) return { error: "Unauthorized" }

  try {
    const message = await prisma.message.findUnique({
      where: { id: messageId },
    })

    if (!message) return { error: "Message not found" }
    if (message.sender_id !== session.user.id) return { error: "Permission denied" }
    if (message.message_type !== "text") return { error: "Only text messages can be edited" }

    // Re-translate if content changed
    let contentTranslated = message.content_translated
    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    const languageOriginal = user?.preferred_language || "ru"
    const targetLanguage = languageOriginal === "ru" ? "Chinese" : "Russian"

    if (content !== message.content) {
      const dewiarTranslation = await translateWithDewiar(
        content,
        languageOriginal === "ru" ? "Russian" : "Chinese",
        targetLanguage
      );

      if (dewiarTranslation) {
        contentTranslated = dewiarTranslation;
      } else if (openai) {
        try {
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
        } catch (e) {
          console.error("Translation error during update:", e)
        }
      }
    }

    const updatedMessage = await prisma.message.update({
      where: { id: messageId },
      data: {
        content: content,
        content_translated: contentTranslated,
        is_edited: true,
      },
    })

    revalidatePath(`/dashboard/rooms/${message.room_id}`)
    return { success: true, message: updatedMessage }
  } catch (error) {
    console.error("Update message error:", error)
    return { error: "Failed to update message" }
  }
}

export async function updateTypingStatus(roomId: string) {
  const session = await getSession()
  if (!session?.user) return { error: "Unauthorized" }

  try {
    await prisma.roomParticipant.update({
      where: {
        room_id_user_id: {
          room_id: roomId,
          user_id: session.user.id,
        },
      },
      data: {
        typing_at: new Date(),
        last_active_at: new Date(),
      },
    })
    return { success: true }
  } catch (error) {
    console.error("Update typing status error:", error)
    return { error: "Failed to update typing status" }
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

  // Fetch messages
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
      reply_to: {
        include: {
          sender: {
            select: {
              id: true,
              full_name: true,
            }
          }
        }
      }
    },
    orderBy: {
      created_at: "asc",
    },
  })

  // Fetch typing status of other participants
  const typingThreshold = new Date(Date.now() - 10000) // 10 seconds ago
  const typingParticipants = await prisma.roomParticipant.findMany({
    where: {
      room_id: roomId,
      user_id: { not: session.user.id },
      typing_at: { gte: typingThreshold },
    },
    include: {
      user: {
        select: {
          full_name: true,
        },
      },
    },
  })

  const isTyping = typingParticipants.length > 0
  const typingUserNames = typingParticipants.map(p => p.user.full_name || "User")

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
    is_edited: msg.is_edited,
    reply_to_id: msg.reply_to_id,
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
    messages: formattedMessages,
    isTyping,
    typingUserNames
  }
}

export async function markAsRead(roomId: string) {
  const session = await getSession()
  if (!session?.user) return { error: "Unauthorized" }

  try {
    await prisma.roomParticipant.update({
      where: {
        room_id_user_id: {
          room_id: roomId,
          user_id: session.user.id,
        },
      },
      data: {
        last_read_at: new Date(),
        last_active_at: new Date(),
      },
    })
    revalidatePath("/dashboard")
    revalidatePath(`/dashboard/rooms/${roomId}`)
    return { success: true }
  } catch (error) {
    console.error("Mark as read error:", error)
    return { error: "Failed to mark as read" }
  }
}

export async function sendMessageAction({
  roomId,
  content,
  messageType,
  fileUrl,
  replyToId,
}: {
  roomId: string
  content: string
  messageType: "text" | "voice" | "file"
  fileUrl?: string
  replyToId?: string
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

  console.log(`Sending message from ${user.full_name} (${languageOriginal}) to ${targetLanguage}`);

  let contentTranslated: string | null = null
  let voiceTranscription: string | null = null

  // AI Processing
  try {
    if (messageType === "text" || (messageType === "voice" && voiceTranscription)) {
      const textToTranslate = messageType === "text" ? content : voiceTranscription;
      
      console.log(`Attempting Dewiar translation for: "${textToTranslate?.substring(0, 30)}..." from ${languageOriginal} to ${targetLanguage}`);
      const dewiarTranslation = await translateWithDewiar(
        textToTranslate!,
        languageOriginal === "ru" ? "Russian" : "Chinese",
        targetLanguage
      );

      if (dewiarTranslation) {
        contentTranslated = dewiarTranslation;
        console.log("Dewiar translation successful:", contentTranslated.substring(0, 30));
      } else {
        console.warn("Dewiar failed or returned null, contentTranslated remains null");
        if (openai) {
          console.log("Falling back to OpenAI for translation...");
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
                content: textToTranslate!,
              },
            ],
          })
          contentTranslated = completion.choices[0].message.content
          console.log("OpenAI translation successful:", contentTranslated?.substring(0, 30));
        }
      }
    }

    if (messageType === "voice" && fileUrl && !voiceTranscription) {
      // Existing voice processing logic...
      console.log("Processing voice message for transcription...");
      // Fetch the audio file
      let file: any; 
      
      if (fileUrl.startsWith("/uploads/")) {
        const fs = await import("fs")
        const path = await import("path")
        const relativePath = fileUrl.startsWith("/") ? fileUrl.slice(1) : fileUrl
        const filePath = path.join(process.cwd(), "public", relativePath)
        file = (await import("fs")).createReadStream(filePath)
      } else {
        const response = await fetch(fileUrl)
        if (!response.ok) throw new Error("Failed to fetch audio file")
        const blob = await response.blob()
        file = new File([blob], "voice.webm", { type: "audio/webm" })
      }

      if (!openai) {
        console.error("OpenAI client is not initialized");
        throw new Error("OpenAI client is missing");
      }

      const transcription = await openai.audio.transcriptions.create({
        file: file,
        model: "whisper-1",
        language: languageOriginal === "ru" ? "ru" : "zh",
      })
      
      voiceTranscription = transcription.text
      console.log("Voice transcription successful:", voiceTranscription.substring(0, 30));

      // Translate the voice transcription
      const dewiarTranslation = await translateWithDewiar(
        voiceTranscription,
        languageOriginal === "ru" ? "Russian" : "Chinese",
        targetLanguage
      );

      if (dewiarTranslation) {
        contentTranslated = dewiarTranslation;
      } else if (openai) {
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
    }
  } catch (error) {
    console.error("AI Processing Error:", error)
    contentTranslated = "DEBUG: Translation Failed"
  }

  // Final fallback if still null
  if (!contentTranslated && messageType === "text") {
    contentTranslated = `DEBUG: No translation for: ${content.substring(0, 10)}...`
  }

  // Insert Message into Database
  try {
    const message = await prisma.message.create({
      data: {
        room_id: roomId,
        sender_id: user.id,
        content: content,
        content_translated: contentTranslated,
        message_type: messageType,
        file_url: fileUrl,
        voice_transcription: voiceTranscription,
        reply_to_id: replyToId,
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
        reply_to: {
          include: {
            sender: {
              select: {
                id: true,
                full_name: true,
              }
            }
          }
        }
      },
    })

    revalidatePath(`/dashboard/rooms/${roomId}`)
    
    // Update last_active_at for the sender
    await prisma.roomParticipant.update({
      where: {
        room_id_user_id: {
          room_id: roomId,
          user_id: user.id,
        },
      },
      data: {
        last_active_at: new Date(),
        last_read_at: new Date(),
      },
    })

    return { 
      success: true, 
      message: {
        ...message,
        created_at: message.created_at.toISOString(),
        is_edited: message.is_edited,
        reply_to: message.reply_to ? {
          id: message.reply_to.id,
          content: message.reply_to.content,
          sender_name: message.reply_to.sender.full_name,
        } : null
      } 
    }
  } catch (error) {
    console.error("Database Error:", error)
    return { error: "Failed to send message" }
  }
}
