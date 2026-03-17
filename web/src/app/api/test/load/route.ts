
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { translationQueue } from "@/lib/translation-queue";
import { processAsyncMessage } from "@/app/actions/chat";

export async function POST(req: NextRequest) {
  try {
    const { roomId, count = 10 } = await req.json();

    if (!roomId) {
      return NextResponse.json({ error: "roomId is required" }, { status: 400 });
    }

    const messages = [];
    const startTime = Date.now();

    // Create dummy user if needed, or assume one exists.
    // For simplicity, we'll pick the first user in DB or fail.
    const sender = await prisma.user.findFirst();
    if (!sender) {
      return NextResponse.json({ error: "No users found in DB to act as sender" }, { status: 500 });
    }

    // 1. Bulk create messages
    for (let i = 0; i < count; i++) {
      const message = await prisma.message.create({
        data: {
          room_id: roomId,
          sender_id: sender.id,
          content: `Load Test Message ${i + 1} - ${Date.now()}`,
          translation_status: "pending",
          language_original: "ru",
          message_type: "text"
        }
      });
      messages.push(message);
    }

    // 2. Queue them for processing
    messages.forEach(msg => {
      // In load test, we might not want to use 'after' since it's an API route. 
      // But actually, 'after' works in API routes too. However, since this is just a test, 
      // we can just call it and return early. But let's wrap it properly so Next.js doesn't kill it.
      // Alternatively, we don't need 'after' here if we just await a Promise.all or leave it as fire-and-forget.
      // Wait, 'after' is only available in Next.js Server Components / Actions / Route Handlers!
      // I'll import 'after' and use it.
      translationQueue.add(async () => {
        await processAsyncMessage(
          msg.id,
          roomId,
          msg.content || "",
          "text",
          undefined,
          "Russian",
          "Chinese"
        );
      });
    });

    return NextResponse.json({ 
      success: true, 
      count: messages.length,
      timeTaken: Date.now() - startTime 
    });

  } catch (error) {
    console.error("Load test error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
