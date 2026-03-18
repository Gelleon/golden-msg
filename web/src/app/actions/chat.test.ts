
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
// @ts-ignore
global.TextDecoder = TextDecoder;

import { processAsyncMessage } from "./chat";
import prisma from "@/lib/db";
import { translateText } from "@/lib/dewiar";
import { sendSSEUpdate } from "@/lib/sse";

// Mocks
jest.mock("@/lib/db", () => ({
  message: {
    findUnique: jest.fn(),
    update: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
  },
  roomParticipant: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
  }
}));

jest.mock("@/lib/dewiar", () => ({
  translateText: jest.fn(),
  transcribeAudio: jest.fn(),
}));

jest.mock("@/lib/sse", () => ({
  sendSSEUpdate: jest.fn(),
}));

// Helper to mock Prisma findUnique
const mockFindUnique = (returnValue: any) => {
  (prisma.message.findUnique as jest.Mock).mockResolvedValue(returnValue);
};

// Helper to mock Prisma findFirst (Cache)
const mockFindFirst = (returnValue: any) => {
  (prisma.message.findFirst as jest.Mock).mockResolvedValue(returnValue);
};

// Helper to mock Translate
const mockTranslate = (returnValue: any) => {
  (translateText as jest.Mock).mockResolvedValue(returnValue);
};

describe("processAsyncMessage", () => {
  const messageId = "msg-123";
  const roomId = "room-123";
  const content = "Hello world";
  const messageType = "text";
  const fileUrl = undefined;
  const langOriginal = "Russian";
  const targetLang = "Chinese";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should translate text successfully and update DB + SSE", async () => {
    // Setup
    mockFindFirst(null); // No cache
    mockTranslate("Привет мир");
    mockFindUnique({ content: "Hello world" }); // Message exists and unchanged

    // Execute
    await processAsyncMessage(
      messageId,
      roomId,
      content,
      messageType,
      fileUrl,
      langOriginal,
      targetLang
    );

    // Assert
    expect(translateText).toHaveBeenCalledWith("Hello world", "Russian", "Chinese");
    
    expect(prisma.message.update).toHaveBeenCalledWith({
      where: { id: messageId },
      data: expect.objectContaining({
        content_translated: "Привет мир",
        translation_status: "completed",
      }),
    });

    expect(sendSSEUpdate).toHaveBeenCalledWith(roomId, expect.objectContaining({
      type: "message_update",
      messageId,
      payload: expect.objectContaining({
        content_translated: "Привет мир",
        translation_status: "completed",
      }),
    }));
  });

  it("should use cached translation if available", async () => {
    // Setup
    mockFindFirst({ content_translated: "Cached Translation" }); // Cache hit
    mockFindUnique({ content: "Hello world" });

    // Execute
    await processAsyncMessage(
      messageId,
      roomId,
      content,
      messageType,
      fileUrl,
      langOriginal,
      targetLang
    );

    // Assert
    expect(translateText).not.toHaveBeenCalled(); // Should not call API
    
    expect(prisma.message.update).toHaveBeenCalledWith({
      where: { id: messageId },
      data: expect.objectContaining({
        content_translated: "Cached Translation",
        translation_status: "completed",
      }),
    });
  });

  it("should abort update if message content changed (Cancellation)", async () => {
    // Setup
    mockFindFirst(null);
    mockTranslate("Translated Old Content");
    // Mock findUnique to return CHANGED content immediately (simulating edit happened before processing)
    // First call (pre-check) returns changed content
    mockFindUnique({ content: "New Edited Content", translation_status: "pending" }); 

    // Execute
    await processAsyncMessage(
      messageId,
      roomId,
      content, // Original content
      messageType,
      fileUrl,
      langOriginal,
      targetLang
    );

    // Assert
    expect(translateText).not.toHaveBeenCalled(); // API should NOT be called (Optimization)
    expect(prisma.message.update).not.toHaveBeenCalled(); // DB NOT updated
    expect(sendSSEUpdate).not.toHaveBeenCalled(); // SSE NOT sent
  });

  it("should handle translation errors gracefully", async () => {
    // Setup
    mockFindFirst(null);
    // translateWithDewiar returns null on error internally
    (translateText as jest.Mock).mockRejectedValue(new Error("API Error"));
    mockFindUnique({ content: "Hello world" });

    // Execute
    await processAsyncMessage(
      messageId,
      roomId,
      content,
      messageType,
      fileUrl,
      langOriginal,
      targetLang
    );

    // Assert
    // Because translateWithDewiar propagates error, we expect "API Error"
    expect(prisma.message.update).toHaveBeenCalledWith({
      where: { id: messageId },
      data: expect.objectContaining({
        translation_status: "failed",
        translation_error: "API Error",
      }),
    });

    expect(sendSSEUpdate).toHaveBeenCalledWith(roomId, expect.objectContaining({
      type: "message_update",
      payload: expect.objectContaining({
        translation_status: "failed",
      }),
    }));
  });
});

import { getMessages } from "./chat";
import { getSession } from "./auth";

jest.mock("./auth", () => ({
  getSession: jest.fn(),
}));

describe("getMessages", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockDate = new Date("2024-01-01T00:00:00Z");

  const mockMessage = (id: string, dateStr: string) => ({
    id,
    content: `Message ${id}`,
    content_translated: null,
    language_original: "ru",
    message_type: "text",
    file_url: null,
    voice_transcription: null,
    created_at: new Date(dateStr),
    is_edited: false,
    translation_status: "completed",
    reply_to_id: null,
    sender: {
      id: "user-1",
      full_name: "Test User",
      avatar_url: null,
      role: "user",
    },
    reply_to: null,
  });

  it("should fetch older messages using cursor pagination", async () => {
    (getSession as jest.Mock).mockResolvedValue({ user: { id: "user-1" } });

    // Mock participation check
    (prisma.roomParticipant.findUnique as jest.Mock).mockResolvedValue({
      room_id: "room-1",
      user_id: "user-1",
    });

    // Mock finding cursor message
    const cursorDate = new Date("2024-01-05T00:00:00Z");
    mockFindUnique({ created_at: cursorDate });

    // Mock fetching messages
    const olderMessages = [
      mockMessage("msg-3", "2024-01-04T00:00:00Z"),
      mockMessage("msg-2", "2024-01-03T00:00:00Z"),
    ];
    (prisma.message.findMany as jest.Mock).mockResolvedValue(olderMessages);
    
    // Mock typing status
    (prisma.roomParticipant.findMany as jest.Mock).mockResolvedValue([]);

    const result = await getMessages("room-1", {
      cursorId: "msg-cursor",
      direction: "older",
      limit: 10,
    });

    expect(prisma.message.findUnique).toHaveBeenCalledWith({
      where: { id: "msg-cursor" },
      select: { created_at: true },
    });

    expect(prisma.message.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          room_id: "room-1",
          created_at: { lt: cursorDate },
        },
        take: 10,
        orderBy: { created_at: "desc" },
      })
    );

    // Messages should be reversed back to asc
    expect(result.messages?.[0].id).toBe("msg-2");
    expect(result.messages?.[1].id).toBe("msg-3");
  });

  it("should fetch newer messages using cursor pagination", async () => {
    (getSession as jest.Mock).mockResolvedValue({ user: { id: "user-1" } });

    // Mock participation check
    (prisma.roomParticipant.findUnique as jest.Mock).mockResolvedValue({
      room_id: "room-1",
      user_id: "user-1",
    });

    // Mock finding cursor message
    const cursorDate = new Date("2024-01-05T00:00:00Z");
    mockFindUnique({ created_at: cursorDate });

    // Mock fetching messages
    const newerMessages = [
      mockMessage("msg-6", "2024-01-06T00:00:00Z"),
      mockMessage("msg-7", "2024-01-07T00:00:00Z"),
    ];
    (prisma.message.findMany as jest.Mock).mockResolvedValue(newerMessages);
    
    // Mock typing status
    (prisma.roomParticipant.findMany as jest.Mock).mockResolvedValue([]);

    const result = await getMessages("room-1", {
      cursorId: "msg-cursor",
      direction: "newer",
      limit: 20,
    });

    expect(prisma.message.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          room_id: "room-1",
          created_at: { gt: cursorDate },
        },
        take: 20,
        orderBy: { created_at: "asc" },
      })
    );

    // Newer messages are already asc, shouldn't be reversed
    expect(result.messages?.[0].id).toBe("msg-6");
    expect(result.messages?.[1].id).toBe("msg-7");
  });
});
