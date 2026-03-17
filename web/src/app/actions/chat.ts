"use server"

import prisma from "@/lib/db"
import { openai } from "@/lib/openai"
import { getSession } from "./auth"
import { revalidatePath } from "next/cache"
import { sendPushNotification } from "@/lib/push-service"
import fs from "fs/promises"
import path from "path"
import { translateText, transcribeAudio } from "@/lib/dewiar"
import { z } from "zod"
import { ensureSchemaFixed } from "@/lib/schema-fix"
import { sendSSEUpdate } from "@/lib/sse"
import { after } from "next/server"

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
    // Better Chinese detection including CJK Unified Ideographs, Extension A-H, and symbols
    const hasChinese = (text: string) => /[\u4e00-\u9fff\u3400-\u4dbf\u20000-\u2a6df\u2a700-\u2b73f\u2b740-\u2b81f\u2b820-\u2ceaf\uf900-\ufaff\u3000-\u303f]/.test(text);
    const hasCyrillic = (text: string) => /[а-яА-ЯёЁ]/.test(text);

    let languageOriginal: "Russian" | "Chinese";
    let targetLanguage: "Russian" | "Chinese";

    console.log(`[UPDATE MESSAGE] Detecting language for: "${content.substring(0, 30)}..."`);

    if (hasChinese(content)) {
      languageOriginal = "Chinese";
      targetLanguage = "Russian";
      console.log("[UPDATE MESSAGE] Detected: Chinese (via Regex)");
    } else if (hasCyrillic(content)) {
      languageOriginal = "Russian";
      targetLanguage = "Chinese";
      console.log("[UPDATE MESSAGE] Detected: Russian (via Regex)");
    } else {
      languageOriginal = "Russian"; // Default to Russian
      targetLanguage = "Chinese";
      console.log("[UPDATE MESSAGE] Detected: Neutral/Fallback (Default: Russian)");
    }

    const finalLangOriginal = languageOriginal === "Russian" ? "ru" : "cn";

    // Update message immediately (Optimistic UI)
    const updatedMessage = await prisma.message.update({
      where: { id: messageId },
      data: {
        content: content,
        content_translated: null, // Clear old translation to show loading state
        translation_status: "pending",
        language_original: finalLangOriginal,
        is_edited: true,
      },
    })

    // Trigger Async Translation (Fire and Forget via Queue)
    after(async () => {
      await translationQueue.add(async () => {
        await processAsyncMessage(
          messageId,
          message.room_id,
          content,
          "text",
          undefined,
          languageOriginal,
          targetLanguage
        );
      });
    });

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
      translation_status: true,
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
    translation_status: msg.translation_status,
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

async function findCachedTranslation(content: string, fromLang: string) {
  try {
    const cached = await prisma.message.findFirst({
      where: {
        content: content,
        language_original: fromLang,
        translation_status: "completed",
        content_translated: { not: null }
      },
      orderBy: { created_at: 'desc' },
      select: { content_translated: true }
    });
    return cached?.content_translated;
  } catch (error) {
    console.warn("Cache lookup failed:", error);
    return null;
  }
}

import { translationQueue } from "@/lib/translation-queue"

export async function processAsyncMessage(
  messageId: string, 
  roomId: string,
  content: string, 
  messageType: "text" | "voice" | "file", 
  fileUrl: string | undefined | null,
  initialLangOriginal: "Russian" | "Chinese", 
  initialTargetLang: "Russian" | "Chinese"
) {
  console.log(`[ASYNC] Processing message ${messageId}`);
  
  try {
    let voiceTranscription: string | null = null;
    let contentTranslated: string | null = null;
    let languageOriginal = initialLangOriginal;
    let textToTranslate = content;

    // 0. Cancellation Check (Optimization)
    // Check if the message content has already changed before we even start
    // This handles the "Cancellation" requirement efficiently
    const preCheckMessage = await prisma.message.findUnique({
      where: { id: messageId },
      select: { content: true, voice_transcription: true, translation_status: true }
    });

    if (!preCheckMessage) {
      console.log(`[ASYNC] Message ${messageId} deleted. Aborting.`);
      return;
    }

    if (messageType === "text" && preCheckMessage.content !== content) {
      console.log(`[ASYNC] Message content changed (Edited). Aborting translation task.`);
      return;
    }

    // 1. Transcription (if voice)
    if (messageType === "voice" && fileUrl) {
      console.log(`[ASYNC] Transcribing voice message from: ${fileUrl}`);
      
      let file: any;
      if (fileUrl.startsWith("/uploads/")) {
        const path = await import("path");
        const relativePath = fileUrl.startsWith("/") ? fileUrl.slice(1) : fileUrl;
        const filePath = path.join(process.cwd(), "public", relativePath);
        const fs = await import("fs/promises");
        const buffer = await fs.readFile(filePath);
        file = new Blob([buffer], { type: "audio/webm" });
      } else {
        const response = await fetch(fileUrl);
        if (!response.ok) throw new Error("Failed to fetch audio file");
        const blob = await response.blob();
        file = blob;
      }

      const transcriptionText = await transcribeAudio(
        file,
        languageOriginal === "Russian" ? "ru" : "zh"
      );

      if (transcriptionText) {
        voiceTranscription = transcriptionText;
        textToTranslate = transcriptionText;
        console.log(`[ASYNC] Transcription successful: "${voiceTranscription.substring(0, 30)}..."`);
        
        // Update DB with transcription immediately
        // Check if message still exists and hasn't been deleted
        const currentMsg = await prisma.message.findUnique({ where: { id: messageId }, select: { id: true } });
        if (currentMsg) {
          await prisma.message.update({
            where: { id: messageId },
            data: { voice_transcription: voiceTranscription }
          });
          
          sendSSEUpdate(roomId, {
            type: "message_update",
            messageId,
            payload: { voice_transcription: voiceTranscription }
          });
        }
      } else {
        console.warn("[ASYNC] Transcription failed or returned null");
      }
    }

    // 2. Translation
    if (textToTranslate) {
      // Check Cache First
      const finalLangOriginal = languageOriginal === "Russian" ? "ru" : "cn";
      const cachedTranslation = await findCachedTranslation(textToTranslate, finalLangOriginal);
      
      if (cachedTranslation) {
        console.log(`[ASYNC] Cache hit for: "${textToTranslate.substring(0, 30)}..."`);
        contentTranslated = cachedTranslation;
      } else {
        console.log(`[ASYNC] Translating text: "${textToTranslate.substring(0, 30)}..."`);
        
        const dewiarTranslation = await translateWithDewiar(
          textToTranslate,
          languageOriginal,
          initialTargetLang
        );

        if (dewiarTranslation) {
          contentTranslated = dewiarTranslation;
          console.log(`[ASYNC] Translation successful: "${contentTranslated.substring(0, 30)}..."`);
        } else {
          console.warn("[ASYNC] Translation failed or returned null");
        }
      }
    }

    // 3. Final Update (Atomic Check)
    // We must check if the message content hasn't changed (wasn't edited) while we were processing
    // If it was edited, we discard this result (Cancellation logic)
    const currentMessage = await prisma.message.findUnique({
      where: { id: messageId },
      select: { content: true, voice_transcription: true }
    });

    if (!currentMessage) {
      console.log(`[ASYNC] Message ${messageId} no longer exists. Aborting update.`);
      return;
    }

    // For voice messages, we check transcription. For text, we check content.
    const dbContent = messageType === "voice" ? currentMessage.voice_transcription : currentMessage.content;
    const processedContent = messageType === "voice" ? voiceTranscription : content;

    // Strict equality check to ensure we don't overwrite newer edits
    // Note: for voice, processedContent might be null if transcription failed, but dbContent would be null too or updated.
    // Ideally, for voice, we just check if it exists.
    // For text, we must match.
    
    let shouldUpdate = true;
    if (messageType === "text" && dbContent !== content) {
      console.log(`[ASYNC] Message content changed (Edited). Aborting translation update.`);
      shouldUpdate = false;
    }

    if (shouldUpdate) {
      const finalStatus = contentTranslated ? "completed" : (textToTranslate ? "failed" : "completed"); 
      
      await prisma.message.update({
        where: { id: messageId },
        data: {
          content_translated: contentTranslated,
          translation_status: finalStatus,
          translation_error: !contentTranslated && textToTranslate ? "Translation returned empty" : null
        }
      });

      // 4. Notify SSE
      sendSSEUpdate(roomId, {
        type: "message_update",
        messageId,
        payload: {
          content_translated: contentTranslated,
          translation_status: finalStatus,
          translation_error: !contentTranslated && textToTranslate ? "Translation returned empty" : null
        }
      });
    }

  } catch (error) {
    console.error("[ASYNC] Processing failed:", error);
    await prisma.message.update({
      where: { id: messageId },
      data: { 
        translation_status: "failed", 
        translation_error: error instanceof Error ? error.message : String(error) 
      }
    });
    
    sendSSEUpdate(roomId, {
      type: "message_update",
      messageId,
      payload: { 
        translation_status: "failed", 
        translation_error: error instanceof Error ? error.message : String(error) 
      }
    });
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
  // Better Chinese detection including CJK Unified Ideographs, Extension A-H, and symbols
  const hasChinese = (text: string) => /[\u4e00-\u9fff\u3400-\u4dbf\u20000-\u2a6df\u2a700-\u2b73f\u2b740-\u2b81f\u2b820-\u2ceaf\uf900-\ufaff\u3000-\u303f]/.test(text);
  const hasCyrillic = (text: string) => /[а-яА-ЯёЁ]/.test(text);

  let languageOriginal: "Russian" | "Chinese";
  let targetLanguage: "Russian" | "Chinese";

  if (messageType === "voice") {
    // For voice messages, content might be empty or a placeholder before transcription
    // Default to Russian for voice messages if no content to analyze
    languageOriginal = "Russian";
    targetLanguage = "Chinese";
    console.log("[AI] Voice message detected: Defaulting to Russian language");
  } else {
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
  }
  
  const finalLangOriginal = languageOriginal === "Russian" ? "ru" : "cn";
  console.log(`[SEND MESSAGE] Original Lang: ${finalLangOriginal}, Target: ${targetLanguage}`);

  // Async Processing Setup
  // We do NOT wait for translation here. We set status to pending and return immediately.
  const contentTranslated = null;
  const voiceTranscription = null;
  const translationStatus = "pending";

  console.log(`[DB] Creating message with translation_status: "pending"`);

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
      translation_status: translationStatus,
    };

    const message = await prisma.message.create({
      data: messageData,
      select: {
        id: true,
        room_id: true,
        content: true,
        content_translated: true,
        language_original: true,
        message_type: true,
        file_url: true,
        voice_transcription: true,
        created_at: true,
        is_edited: true,
        reply_to_id: true,
        translation_status: true,
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
    });

    // Trigger Async Processing (via Queue)
    after(async () => {
      await translationQueue.add(async () => {
        await processAsyncMessage(
          message.id,
          roomId,
          content,
          messageType,
          fileUrl,
          languageOriginal,
          targetLanguage
        );
      });
    });

    // Send push notification asynchronously
    const notificationContent = messageType === 'voice' 
      ? 'Voice message' 
      : (content.length > 50 ? content.substring(0, 50) + '...' : content);

    // Fetch room participants to notify
    const participants = await prisma.roomParticipant.findMany({
      where: {
        room_id: roomId,
        user_id: { not: session.user.id }
      },
      select: { user_id: true }
    });
    
    // Send notifications in background
    Promise.all(participants.map(p => 
      sendPushNotification(
        p.user_id,
        {
          title: `New message from ${user.full_name}`,
          body: notificationContent,
          url: `/dashboard/rooms/${roomId}`
        }
      )
    )).catch(err => console.error("Push notification error:", err));

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
        // Ensure frontend gets the pending status
        translation_status: "pending",
        reply_to: message.reply_to ? {
          id: message.reply_to.id,
          content: message.reply_to.content,
          sender_name: message.reply_to.sender.full_name,
        } : null
      } 
    }
  } catch (error) {
    console.error("Send message error:", error)
    return { error: "Failed to send message" }
  }
}
