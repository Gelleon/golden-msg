import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/app/actions/auth";
import { sseEmitter } from "@/lib/sse";

export const dynamic = "force-dynamic";
export const maxDuration = 0; // Allow long-running SSE connections

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const roomId = searchParams.get("roomId");

  if (!roomId) {
    return new Response("Missing roomId", { status: 400 });
  }

  const session = await getSession()
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 })
  }

  const room = await prisma.room.findUnique({
    where: { id: roomId },
    select: { id: true, created_by: true },
  })
  if (!room) {
    return new Response("Room not found", { status: 404 })
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })
  if (!currentUser) {
    return new Response("Unauthorized", { status: 401 })
  }

  const isAdminOrManager = ["admin", "manager"].includes(currentUser.role || "")
  const isCreator = room.created_by === session.user.id
  if (!isAdminOrManager && !isCreator) {
    const membership = await prisma.roomParticipant.findUnique({
      where: { room_id_user_id: { room_id: roomId, user_id: session.user.id } },
      select: { user_id: true },
    })
    if (!membership) {
      return new Response("Forbidden", { status: 403 })
    }
  }

  let isClosed = false;
  let interval: NodeJS.Timeout;
  const eventName = `message-${roomId}`;
  
  // Create a placeholder for onMessage so we can reference it in cancel
  let onMessage: (data: any) => void = () => {};

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      const send = (data: any) => {
        if (isClosed || req.signal.aborted) return;
        try {
          const message = `data: ${JSON.stringify(data)}\n\n`;
          controller.enqueue(encoder.encode(message));
        } catch (err) {
          console.warn(`[SSE ROUTE] Error enqueueing to room ${roomId}:`, err);
          isClosed = true;
        }
      };

      // Send initial ping
      send({ type: "ping", timestamp: Date.now() });

      onMessage = (data: any) => {
        if (isClosed) return;
        console.log(`[SSE ROUTE] Sending update to client for room ${roomId}`);
        send(data);
      };

      sseEmitter.on(eventName, onMessage);

      // Heartbeat to keep connection alive
      interval = setInterval(() => {
        send({ type: "ping", timestamp: Date.now() });
      }, 15000);

      req.signal.addEventListener("abort", () => {
        isClosed = true;
        sseEmitter.off(eventName, onMessage);
        clearInterval(interval);
      });
    },
    cancel() {
      isClosed = true;
      sseEmitter.off(eventName, onMessage);
      clearInterval(interval);
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
