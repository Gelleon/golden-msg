const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/actions/chat.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Append pinMessage and unpinMessage
if (!content.includes('export async function pinMessage')) {
  content += `

export async function pinMessage(messageId: string, roomId: string) {
  const session = await getSession()
  if (!session?.user) return { error: "Unauthorized" }

  try {
    // Verify permissions
    const participation = await prisma.roomParticipant.findUnique({
      where: {
        room_id_user_id: {
          room_id: roomId,
          user_id: session.user.id,
        },
      },
    })

    if (!participation || (participation.role !== 'admin' && participation.role !== 'owner')) {
      // Actually we should check if they are owner of room, or just admin role
      const room = await prisma.room.findUnique({ where: { id: roomId } })
      if (room?.created_by !== session.user.id && participation?.role !== 'admin') {
        return { error: "Permission denied: Only room owner or admins can pin messages" }
      }
    }

    // Check max pinned messages
    const pinnedCount = await prisma.message.count({
      where: {
        room_id: roomId,
        is_pinned: true,
      }
    })

    if (pinnedCount >= 5) {
      return { error: "Maximum of 5 pinned messages reached" }
    }

    const message = await prisma.message.update({
      where: { id: messageId },
      data: { is_pinned: true },
      select: {
        id: true,
        content: true,
        message_type: true,
        is_pinned: true,
        sender: { select: { full_name: true } }
      }
    })

    sendSSEUpdate(roomId, {
      type: 'message_update',
      messageId: messageId,
      payload: { is_pinned: true }
    })

    sendSSEUpdate(roomId, {
      type: 'pinned_messages_update'
    })

    revalidatePath(\`/dashboard/rooms/\${roomId}\`)
    return { success: true }
  } catch (error) {
    console.error("Pin message error:", error)
    return { error: "Failed to pin message" }
  }
}

export async function unpinMessage(messageId: string, roomId: string) {
  const session = await getSession()
  if (!session?.user) return { error: "Unauthorized" }

  try {
    // Verify permissions
    const participation = await prisma.roomParticipant.findUnique({
      where: {
        room_id_user_id: {
          room_id: roomId,
          user_id: session.user.id,
        },
      },
    })

    if (!participation || (participation.role !== 'admin' && participation.role !== 'owner')) {
      const room = await prisma.room.findUnique({ where: { id: roomId } })
      if (room?.created_by !== session.user.id && participation?.role !== 'admin') {
        return { error: "Permission denied: Only room owner or admins can unpin messages" }
      }
    }

    const message = await prisma.message.update({
      where: { id: messageId },
      data: { is_pinned: false },
      select: {
        id: true,
        is_pinned: true,
      }
    })

    sendSSEUpdate(roomId, {
      type: 'message_update',
      messageId: messageId,
      payload: { is_pinned: false }
    })

    sendSSEUpdate(roomId, {
      type: 'pinned_messages_update'
    })

    revalidatePath(\`/dashboard/rooms/\${roomId}\`)
    return { success: true }
  } catch (error) {
    console.error("Unpin message error:", error)
    return { error: "Failed to unpin message" }
  }
}

export async function getPinnedMessages(roomId: string) {
  const session = await getSession()
  if (!session?.user) return { error: "Unauthorized" }

  try {
    const messages = await prisma.message.findMany({
      where: {
        room_id: roomId,
        is_pinned: true,
      },
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        content: true,
        message_type: true,
        file_url: true,
        sender: {
          select: {
            full_name: true,
          }
        }
      }
    })

    return { messages }
  } catch (error) {
    console.error("Get pinned messages error:", error)
    return { error: "Failed to get pinned messages" }
  }
}
`;
}

// 2. Add is_pinned to all message selects and mappings
// a. updateMessage
content = content.replace(
  /is_edited: true,\n\s*translation_status: true,/g,
  "is_edited: true,\n        is_pinned: true,\n        translation_status: true,"
);

content = content.replace(
  /is_edited: updatedMessage\.is_edited,\n\s*translation_status: updatedMessage\.translation_status,/g,
  "is_edited: updatedMessage.is_edited,\n      is_pinned: updatedMessage.is_pinned ?? false,\n      translation_status: updatedMessage.translation_status,"
);

// b. getMessages
content = content.replace(
  /is_edited: true,\n\s*translation_status: true,/g,
  "is_edited: true,\n        is_pinned: true,\n        translation_status: true,"
);

content = content.replace(
  /is_edited: msg\.is_edited,\n\s*translation_status: msg\.translation_status,/g,
  "is_edited: msg.is_edited,\n      is_pinned: msg.is_pinned ?? false,\n      translation_status: msg.translation_status,"
);

// c. sendMessageAction select
content = content.replace(
  /created_at: true,\n\s*is_edited: true,\n\s*reply_to_id: true,\n\s*translation_status: true,/g,
  "created_at: true,\n          is_edited: true,\n          is_pinned: true,\n          reply_to_id: true,\n          translation_status: true,"
);

content = content.replace(
  /created_at: message\.created_at\.toISOString\(\),\n\s*is_edited: message\.is_edited,\n\s*reply_to_id: message\.reply_to_id \?\? null,\n\s*translation_status: translationStatus,/g,
  "created_at: message.created_at.toISOString(),\n        is_edited: message.is_edited,\n        is_pinned: message.is_pinned ?? false,\n        reply_to_id: message.reply_to_id ?? null,\n        translation_status: translationStatus,"
);

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Successfully patched chat.ts');
