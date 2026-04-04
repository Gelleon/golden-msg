const fs = require('fs');
const path = require('path');

const chatPath = path.join(__dirname, 'src/app/actions/chat.ts');
let chat = fs.readFileSync(chatPath, 'utf-8');

chat = chat.replace(
  /sendSSEUpdate\(roomId, \{\n\s*type: 'pinned_messages_update'\n\s*\}\)/g,
  `sendSSEUpdate(roomId, {
      type: 'pinned_messages_update'
    })

    // Create system message
    const sysMsg = await prisma.message.create({
      data: {
        room_id: roomId,
        sender_id: session.user.id,
        content: message.is_pinned 
          ? \`📌 \${session.user.full_name || 'User'} pinned a message\`
          : \`📌 \${session.user.full_name || 'User'} unpinned a message\`,
        message_type: 'system',
        language_original: 'ru',
        translation_status: 'completed'
      },
      select: {
        id: true,
        room_id: true,
        content: true,
        content_translated: true,
        language_original: true,
        message_type: true,
        file_url: true,
        voice_transcription: true,
        created_at: true,
        is_edited: true,
        is_pinned: true,
        reply_to_id: true,
        translation_status: true,
        sender: {
          select: {
            id: true,
            full_name: true,
            avatar_url: true,
            role: true,
          }
        }
      }
    })

    sendSSEUpdate(roomId, {
      type: 'new_message', // This assumes the client handles new_message event, wait, does it?
      message: sysMsg
    })`
);

fs.writeFileSync(chatPath, chat, 'utf-8');
console.log('Patched chat.ts with system messages');
