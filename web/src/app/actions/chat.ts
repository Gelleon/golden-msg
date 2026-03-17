"use server"

import prisma from "@/lib/db"
import { openai } from "@/lib/openai"
import { getSession } from "./auth"
import { revalidatePath } from "next/cache"
import { sendPushNotification } from "@/lib/push-service"
import fs from "fs/promises"
import path from "path"
import { translateText } from "@/lib/dewiar"
import { z } from "zod"
import { ensureSchemaFixed } from "@/lib/schema-fix"

const sendMessageSchema = z.object({
  roomId: z.string().uuid(),
  content: z.string().min(1).max(5000),
  messageType: z.enum(["text", "voice", "file"]),
  fileUrl: z.string().optional(),
  replyToId: z.string().uuid().optional(),
})

async function translateWithDewiar(text: string, fromLang: string, toLang: string) {
  try {
    console.log(`[CHAT ACTION] Requesting translation: "${text.substring(0, 20)}..." from ${fromLang} to ${toLang}`);
    const translation = await translateText(text, fromLang, toLang);
    
    if (translation) {
      console.log(`[CHAT ACTION] Translation received: "${translation.substring(0, 20)}..."`);
      return translation;
    }
    
    console.warn(`[CHAT ACTION] translateText returned null for: "${text.substring(0, 20)}..."`);
    return null;
  } catch (error) {
    console.error(`[CHAT ACTION] Error in translateWithDewiar:`, error);
    return null;
  }
}

export async function deleteMessage(messageId: string) {
  await ensureSchemaFixed()
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
  await ensureSchemaFixed()
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
    await prisma.user.findUnique({ 
      where: { id: session.user.id },
      select: {
        id: true,
        // @ts-ignore
        preferred_language: true 
      }
    })
    
    // Language Detection Helpers
    const hasChinese = (text: string) => /[\u4e00-\u9fff\u3400-\u4dbf]/.test(text);
    const hasCyrillic = (text: string) => /[а-яА-ЯёЁ]/.test(text);

    let languageOriginal: "Russian" | "Chinese";
    let targetLanguage: "Russian" | "Chinese";

    if (hasChinese(content)) {
      languageOriginal = "Chinese";
      targetLanguage = "Russian";
    } else if (hasCyrillic(content)) {
      languageOriginal = "Russian";
      targetLanguage = "Chinese";
    } else {
      languageOriginal = "Russian"; // Default to Russian
      targetLanguage = languageOriginal === "Russian" ? "Chinese" : "Russian";
    }

    if (content !== message.content) {
      const dewiarTranslation = await translateWithDewiar(
        content,
        languageOriginal,
        targetLanguage
      );

      if (dewiarTranslation) {
        contentTranslated = dewiarTranslation;
      }
    }

    const finalLangOriginal = languageOriginal === "Russian" ? "ru" : "cn";

    const updatedMessage = await prisma.message.update({
      where: { id: messageId },
      data: {
        content: content,
        content_translated: contentTranslated,
        language_original: finalLangOriginal,
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
  await ensureSchemaFixed()
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
    select: {
      id: true,
      content: true,
      content_translated: true,
      language_original: true,
      message_type: true,
      file_url: true,
      voice_transcription: true,
      created_at: true,
      is_edited: true,
      reply_to_id: true,
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
    language_original: msg.language_original || "ru",
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

export async function sendMessageAction(rawData: {
  roomId: string
  content: string
  messageType: "text" | "voice" | "file"
  fileUrl?: string
  replyToId?: string
}) {
  await ensureSchemaFixed()
  console.log(`[ACTION] sendMessageAction start: ${JSON.stringify(rawData).substring(0, 100)}...`);
  const session = await getSession()
  if (!session?.user) return { error: "Unauthorized" }

  // 1. Validate Input
  const validated = sendMessageSchema.safeParse(rawData)
  if (!validated.success) {
    return { error: "Invalid message data" }
  }

  const { roomId, content, messageType, fileUrl, replyToId } = validated.data
  console.log(`[SEND MESSAGE] Validated: ${JSON.stringify(validated.data).substring(0, 50)}...`);

  // 2. Check Participation
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

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      full_name: true,
      avatar_url: true,
      role: true,
      // @ts-ignore
      // preferred_language: true 
    }
  })

  if (!user) {
    return { error: "User not found" }
  }

  // Language Detection Helpers
  const hasChinese = (text: string) => /[\u4e00-\u9fff\u3400-\u4dbf]/.test(text);
  const hasCyrillic = (text: string) => /[а-яА-ЯёЁ]/.test(text);

  let languageOriginal: "Russian" | "Chinese";
  let targetLanguage: "Russian" | "Chinese";

  console.log(`[AI] Detecting language for text: "${content.substring(0, 30)}..."`);

  if (hasChinese(content)) {
    languageOriginal = "Chinese";
    targetLanguage = "Russian";
    console.log("[AI] Detected: Chinese (via Regex)");
  } else if (hasCyrillic(content)) {
    languageOriginal = "Russian";
    targetLanguage = "Chinese";
    console.log("[AI] Detected: Russian (via Regex)");
  } else {
    // Fallback to Russian
    languageOriginal = "Russian";
    targetLanguage = "Chinese";
    console.log(`[AI] Detected: Neutral/Fallback (Default: Russian)`);
  }
  
  const finalLangOriginal = languageOriginal === "Russian" ? "ru" : "cn";
  console.log(`[SEND MESSAGE] Original Lang: ${finalLangOriginal}, Target: ${targetLanguage}`);

  let contentTranslated: string | null = null
  let voiceTranscription: string | null = null

  // AI Processing
  const dewarTokenExists = !!process.env.DEWIAR_API_TOKEN;
  console.log(`[AI] Processing tokens check: Dewiar=${dewarTokenExists}`);

  try {
    if (messageType === "text" || (messageType === "voice" && voiceTranscription)) {
      const textToTranslate = messageType === "text" ? content : voiceTranscription;
      
      const fromLangParam = languageOriginal;
      console.log(`[AI] Attempting Dewiar translation for: "${textToTranslate?.substring(0, 30)}..." from ${fromLangParam} to ${targetLanguage}`);
      
      const dewiarTranslation = await translateWithDewiar(
        textToTranslate!,
        fromLangParam,
        targetLanguage
      );

      if (dewiarTranslation) {
        contentTranslated = dewiarTranslation;
        console.log(`[AI] Dewiar translation SUCCESS: "${contentTranslated.substring(0, 30)}..."`);
      } else {
        console.warn(`[AI] Dewiar FAILED (returned null) for text: "${textToTranslate?.substring(0, 30)}..."`);
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
        language: languageOriginal === "Russian" ? "ru" : "zh",
      })
      
      voiceTranscription = transcription.text
      console.log("Voice transcription successful:", voiceTranscription.substring(0, 30));

      // Translate the voice transcription
      const dewiarTranslation = await translateWithDewiar(
        voiceTranscription,
        languageOriginal,
        targetLanguage
      );

      if (dewiarTranslation) {
        contentTranslated = dewiarTranslation;
      }
    }
  } catch (error) {
    console.error("AI Processing Error:", error)
    contentTranslated = `DEBUG: AI Error (${error instanceof Error ? error.message : String(error)})`
  }

  // Final fallback if still null
  if (!contentTranslated && messageType === "text") {
    const reason = !dewarTokenExists ? "Dewiar Token Missing" : "Dewiar returned null";
    contentTranslated = `DEBUG: No translation (${reason}) for: ${content.substring(0, 10)}...`
  }

  console.log(`[DB] Creating message with contentTranslated: "${contentTranslated?.substring(0, 50)}..."`);

  // Insert Message into Database
  try {
    const messageData: any = {
      room_id: roomId,
      sender_id: user.id,
      content: content,
      content_translated: contentTranslated,
      language_original: finalLangOriginal,
      message_type: messageType,
      file_url: fileUrl,
      voice_transcription: voiceTranscription,
      reply_to_id: replyToId,
    };

    const message = await prisma.message.create({
      data: messageData,
      select: {
        id: true,
        content: true,
        content_translated: true,
        language_original: true,
        message_type: true,
        file_url: true,
        voice_transcription: true,
        created_at: true,
        is_edited: true,
        reply_to_id: true,
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
      },
    })

    revalidatePath(`/dashboard/rooms/${roomId}`)
    
    // Push notifications for other room members
    try {
      const room = await prisma.room.findUnique({
        where: { id: roomId },
        include: {
          participants: {
            where: {
              user_id: { not: user.id }
            },
            include: {
              user: {
                select: {
                  id: true,
                  push_notifications_enabled: true,
                  // @ts-ignore
                  // preferred_language: true, 
                }
              }
            }
          }
        }
      });

      if (room) {
        for (const participant of room.participants) {
          if (participant.user.push_notifications_enabled) {
            // @ts-ignore
            const lang = participant.user.preferred_language || 'ru';
            const title = lang === 'cn' ? `新消息: ${room.name || '房间'}` : `Новое сообщение: ${room.name || 'Комната'}`;
            const body = messageType === 'text' 
              ? `${user.full_name}: ${content?.substring(0, 50)}${content && content.length > 50 ? '...' : ''}`
              : `${user.full_name} отправил ${messageType === 'voice' ? 'голосовое сообщение' : 'файл'}`;
            
            await sendPushNotification(participant.user.id, {
              title,
              body,
              url: `/dashboard/rooms/${roomId}`
            });
          }
        }
      }
    } catch (pushError) {
      console.error("Push notification error:", pushError);
      // Continue execution - push failure shouldn't fail the message send
    }
    
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
    return { error: `Failed to send message: ${error instanceof Error ? error.message : String(error)}` }
  }
}
