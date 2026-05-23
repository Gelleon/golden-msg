import { EventEmitter } from 'events';

// Use a global variable to store the emitter to survive hot reloads in development
const globalForSSE = global as unknown as { sseEmitter: EventEmitter };

if (!globalForSSE.sseEmitter) {
  globalForSSE.sseEmitter = new EventEmitter();
  globalForSSE.sseEmitter.setMaxListeners(100);
}

export const sseEmitter = globalForSSE.sseEmitter;

export function sendSSEUpdate(roomId: string, data: Record<string, unknown>) {
  console.log(`[SSE] Emitting update for room ${roomId}:`, JSON.stringify(data).substring(0, 100));
  sseEmitter.emit(`message-${roomId}`, data);
}

export function sendSSEUserUpdate(userId: string, data: Record<string, unknown>) {
  console.log(`[SSE] Emitting global update for user ${userId}:`, JSON.stringify(data).substring(0, 100));
  sseEmitter.emit(`user-${userId}`, data);
}
