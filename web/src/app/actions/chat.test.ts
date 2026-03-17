
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
  },
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
    // Because translateWithDewiar catches error and returns null, we expect "Translation returned empty"
    expect(prisma.message.update).toHaveBeenCalledWith({
      where: { id: messageId },
      data: expect.objectContaining({
        translation_status: "failed",
        translation_error: "Translation returned empty",
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
