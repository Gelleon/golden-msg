const fs = require('fs');
const path = require('path');

// --- Patch chat-window.tsx ---
const chatWindowPath = path.join(__dirname, 'src/components/chat/chat-window.tsx');
let chatWindow = fs.readFileSync(chatWindowPath, 'utf-8');

chatWindow = chatWindow.replace(
  /<MessageBubble\n\s*message=\{message\}/g,
  '<MessageBubble\n                      roomId={roomId}\n                      message={message}'
);

fs.writeFileSync(chatWindowPath, chatWindow, 'utf-8');
console.log('Patched chat-window.tsx');

// --- Patch message-bubble.tsx ---
const messageBubblePath = path.join(__dirname, 'src/components/chat/message-bubble.tsx');
let messageBubble = fs.readFileSync(messageBubblePath, 'utf-8');

// 1. Add lucide-react Pin icon
messageBubble = messageBubble.replace(
  /Trash2, AlertTriangle, Pencil, X, Check, Reply, CornerUpLeft, Copy/,
  'Trash2, AlertTriangle, Pencil, X, Check, Reply, CornerUpLeft, Copy, Pin'
);

// 2. Add is_pinned to Message interface
messageBubble = messageBubble.replace(
  /is_edited\?: boolean/,
  'is_edited?: boolean\n  is_pinned?: boolean'
);

// 3. Add roomId to MessageBubbleProps
messageBubble = messageBubble.replace(
  /currentUserRole\?: string/,
  'roomId?: string\n  currentUserRole?: string'
);

// 4. Add roomId to destructuring
messageBubble = messageBubble.replace(
  /export function MessageBubble\(\{ message, isCurrentUser, onReply, onDelete, showSenderName, showAvatar = true, currentUserRole, participants = \[\] \}: MessageBubbleProps\) \{/,
  'export function MessageBubble({ roomId, message, isCurrentUser, onReply, onDelete, showSenderName, showAvatar = true, currentUserRole, participants = [] }: MessageBubbleProps) {'
);

// 5. Add pinMessage and unpinMessage to imports
messageBubble = messageBubble.replace(
  /import \{ deleteMessage, updateMessage \} from "@\/app\/actions\/chat"/,
  'import { deleteMessage, updateMessage, pinMessage, unpinMessage } from "@/app/actions/chat"'
);

// 6. Add handlePin and handleUnpin functions inside MessageBubble
messageBubble = messageBubble.replace(
  /const handleUpdate = async \(\) => \{/,
  `const handlePin = async () => {
    if (!roomId) return;
    const res = await pinMessage(message.id, roomId);
    if (res?.error) {
      toast({ title: "Error", description: res.error, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Message pinned" });
    }
  }

  const handleUnpin = async () => {
    if (!roomId) return;
    const res = await unpinMessage(message.id, roomId);
    if (res?.error) {
      toast({ title: "Error", description: res.error, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Message unpinned" });
    }
  }

  const handleUpdate = async () => {`
);

// 7. Add Pin/Unpin ContextMenu Items
// We need to find the ContextMenuContent block
messageBubble = messageBubble.replace(
  /<ContextMenuItem onClick=\{handleCopyText\} className="cursor-pointer">/,
  `{isCurrentUserAdmin && !message.is_pinned && (
                  <ContextMenuItem onClick={handlePin} className="cursor-pointer">
                    <Pin className="h-4 w-4 mr-2" />
                    {t.chat?.pin || "Pin"}
                  </ContextMenuItem>
                )}
                {isCurrentUserAdmin && message.is_pinned && (
                  <ContextMenuItem onClick={handleUnpin} className="cursor-pointer text-orange-500 focus:text-orange-500">
                    <Pin className="h-4 w-4 mr-2" />
                    {t.chat?.unpin || "Unpin"}
                  </ContextMenuItem>
                )}
                <ContextMenuItem onClick={handleCopyText} className="cursor-pointer">`
);

// 8. Add Pin icon to the message bubble next to time
// We need to find the time block
messageBubble = messageBubble.replace(
  /<span className="text-xs opacity-70 whitespace-nowrap">/,
  `{message.is_pinned && <Pin className="h-3 w-3 inline-block mr-1 opacity-70" />}
              <span className="text-xs opacity-70 whitespace-nowrap">`
);

// 9. Add Pin/Unpin to hover actions (group-hover:opacity-100)
// This is the div with className="absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 ..."
messageBubble = messageBubble.replace(
  /<Button\n\s*variant="ghost"\n\s*size="icon"\n\s*className="h-8 w-8 text-muted-foreground hover:text-foreground bg-background\/50 backdrop-blur-sm shadow-sm"\n\s*onClick=\{handleCopyText\}\n\s*title=\{t\.chat\?.copy \|\| "Copy"\}\n\s*>/,
  `{isCurrentUserAdmin && roomId && (
            <Button
              variant="ghost"
              size="icon"
              className={cn("h-8 w-8 text-muted-foreground hover:text-foreground bg-background/50 backdrop-blur-sm shadow-sm", message.is_pinned && "text-orange-500 hover:text-orange-600")}
              onClick={message.is_pinned ? handleUnpin : handlePin}
              title={message.is_pinned ? (t.chat?.unpin || "Unpin") : (t.chat?.pin || "Pin")}
            >
              <Pin className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground bg-background/50 backdrop-blur-sm shadow-sm"
            onClick={handleCopyText}
            title={t.chat?.copy || "Copy"}
          >`
);

fs.writeFileSync(messageBubblePath, messageBubble, 'utf-8');
console.log('Patched message-bubble.tsx');

