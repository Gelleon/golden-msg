import { EventEmitter } from 'events';

// Use a global variable to store the emitter to survive hot reloads in development
const globalForSSE = global as unknown as { sseEmitter: EventEmitter };

export const sseEmitter = globalForSSE.sseEmitter || new EventEmitter();

if (process.env.NODE_ENV !== 'production') {
  globalForSSE.sseEmitter = sseEmitter;
}

export function sendSSEUpdate(roomId: string, data: any) {
  sseEmitter.emit(`message-${roomId}`, data);
}
