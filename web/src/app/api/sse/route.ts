import { NextRequest } from "next/server";
import { sseEmitter } from "@/lib/sse";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const roomId = searchParams.get("roomId");

  if (!roomId) {
    return new Response("Missing roomId", { status: 400 });
  }

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      const send = (data: any) => {
        const message = `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(message));
      };

      // Send initial ping
      send({ type: "ping", timestamp: Date.now() });

      const onMessage = (data: any) => {
        send(data);
      };

      const eventName = `message-${roomId}`;
      sseEmitter.on(eventName, onMessage);

      req.signal.addEventListener("abort", () => {
        sseEmitter.off(eventName, onMessage);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
