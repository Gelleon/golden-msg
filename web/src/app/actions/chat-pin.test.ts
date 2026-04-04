
import { pinMessage, unpinMessage } from "./chat";
import prisma from "@/lib/db";
import { getSession } from "./auth";
import { sendSSEUpdate } from "@/lib/sse";

// Mocks
jest.mock("@/lib/db", () => ({
  message: {
    count: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
  },
  roomParticipant: {
    findUnique: jest.fn(),
  },
  room: {
    findUnique: jest.fn(),
  }
}));

jest.mock("./auth", () => ({
  getSession: jest.fn(),
}));

jest.mock("@/lib/sse", () => ({
  sendSSEUpdate: jest.fn(),
}));

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

describe("Pin/Unpin Messages", () => {
  const mockSession = {
    user: {
      id: "user-123",
      full_name: "Test User",
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getSession as jest.Mock).mockResolvedValue(mockSession);
  });

  describe("pinMessage", () => {
    it("should fail if user is not authorized", async () => {
      (getSession as jest.Mock).mockResolvedValue(null);
      const result = await pinMessage("msg-1", "room-1");
      expect(result.error).toBe("Unauthorized");
    });

    it("should fail if user is not a participant", async () => {
      (prisma.roomParticipant.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await pinMessage("msg-1", "room-1");
      expect(result.error).toContain("Permission denied");
    });

    it("should fail if maximum pinned messages reached", async () => {
      (prisma.roomParticipant.findUnique as jest.Mock).mockResolvedValue({ role: "admin" });
      (prisma.message.count as jest.Mock).mockResolvedValue(5);

      const result = await pinMessage("msg-1", "room-1");
      expect(result.error).toBe("Maximum of 5 pinned messages reached");
    });

    it("should successfully pin a message and send SSE updates", async () => {
      (prisma.roomParticipant.findUnique as jest.Mock).mockResolvedValue({ role: "admin" });
      (prisma.message.count as jest.Mock).mockResolvedValue(2);
      
      const mockUpdatedMessage = {
        id: "msg-1",
        content: "Test message",
        message_type: "text",
        is_pinned: true,
        sender: { full_name: "Other User" }
      };
      
      (prisma.message.update as jest.Mock).mockResolvedValue(mockUpdatedMessage);
      (prisma.message.create as jest.Mock).mockResolvedValue({
        id: "sys-1",
        content: "Test User pinned a message"
      });

      const result = await pinMessage("msg-1", "room-1");
      
      expect(result.success).toBe(true);
      expect(prisma.message.update).toHaveBeenCalledWith({
        where: { id: "msg-1" },
        data: { is_pinned: true },
        select: expect.any(Object)
      });
      
      expect(sendSSEUpdate).toHaveBeenCalledWith("room-1", {
        type: "message_update",
        messageId: "msg-1",
        payload: { is_pinned: true }
      });
      
      expect(sendSSEUpdate).toHaveBeenCalledWith("room-1", {
        type: "pinned_messages_update"
      });
    });
  });
});
