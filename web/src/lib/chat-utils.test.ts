import { getInitialRoomMessages } from "./chat-utils";
import prisma from "@/lib/db";

jest.mock("@/lib/db", () => ({
  message: {
    count: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
  },
}));

describe("getInitialRoomMessages", () => {
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
    sender: {
      id: "user-1",
      full_name: "Test User",
      avatar_url: null,
      role: "user",
    },
    reply_to: null,
  });

  it("should return the latest 30 messages if there are no unread messages", async () => {
    (prisma.message.count as jest.Mock).mockResolvedValue(0);
    
    const latestMessages = [
      mockMessage("msg-2", "2024-01-02T00:00:00Z"),
      mockMessage("msg-1", "2024-01-01T00:00:00Z"),
    ];
    (prisma.message.findMany as jest.Mock).mockResolvedValue(latestMessages);

    const result = await getInitialRoomMessages("room-1", "user-1", mockDate);

    expect(prisma.message.count).toHaveBeenCalledWith({
      where: {
        room_id: "room-1",
        created_at: { gt: mockDate },
        sender_id: { not: "user-1" }
      }
    });

    expect(prisma.message.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { room_id: "room-1" },
        orderBy: { created_at: "desc" },
        take: 30,
      })
    );

    expect(result.unreadCount).toBe(0);
    expect(result.anchorId).toBeNull();
    // Messages should be reversed
    expect(result.messages[0].id).toBe("msg-1");
    expect(result.messages[1].id).toBe("msg-2");
  });

  it("should find the first unread message and load surrounding messages if unreadCount > 0", async () => {
    (prisma.message.count as jest.Mock).mockResolvedValue(5);
    
    const firstUnreadDate = new Date("2024-01-05T00:00:00Z");
    (prisma.message.findFirst as jest.Mock).mockResolvedValue({
      id: "msg-unread-1",
      created_at: firstUnreadDate
    });

    const olderMessages = [
      mockMessage("msg-older-1", "2024-01-04T00:00:00Z")
    ];
    const newerMessages = [
      mockMessage("msg-unread-1", "2024-01-05T00:00:00Z"),
      mockMessage("msg-newer-1", "2024-01-06T00:00:00Z")
    ];

    (prisma.message.findMany as jest.Mock)
      .mockResolvedValueOnce(olderMessages) // First call for older
      .mockResolvedValueOnce(newerMessages); // Second call for newer

    const result = await getInitialRoomMessages("room-1", "user-1", mockDate);

    expect(prisma.message.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          room_id: "room-1",
          created_at: { gt: mockDate },
          sender_id: { not: "user-1" }
        },
        orderBy: { created_at: "asc" }
      })
    );

    // Verify older messages fetch
    expect(prisma.message.findMany).toHaveBeenNthCalledWith(1,
      expect.objectContaining({
        where: { room_id: "room-1", created_at: { lt: firstUnreadDate } },
        orderBy: { created_at: "desc" },
        take: 10,
      })
    );

    // Verify newer messages fetch
    expect(prisma.message.findMany).toHaveBeenNthCalledWith(2,
      expect.objectContaining({
        where: { room_id: "room-1", created_at: { gte: firstUnreadDate } },
        orderBy: { created_at: "asc" },
        take: 20,
      })
    );

    expect(result.unreadCount).toBe(5);
    expect(result.anchorId).toBe("msg-unread-1");
    // Result array should combine reversed older and newer
    expect(result.messages.map(m => m.id)).toEqual([
      "msg-older-1",
      "msg-unread-1",
      "msg-newer-1"
    ]);
  });
});
