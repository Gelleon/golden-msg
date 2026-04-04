const fs = require('fs');
const path = require('path');

const chatWindowPath = path.join(__dirname, 'src/components/chat/chat-window.tsx');
let chatWindow = fs.readFileSync(chatWindowPath, 'utf-8');

if (!chatWindow.includes('PinnedMessagesBar')) {
  // 1. Add import
  chatWindow = chatWindow.replace(
    /import \{ MessageBubble \} from "@\/components\/chat\/message-bubble"/,
    'import { MessageBubble } from "@/components/chat/message-bubble"\nimport { PinnedMessagesBar } from "@/components/chat/pinned-messages-bar"'
  );

  // 2. Add handleMessageClick function inside ChatWindow
  chatWindow = chatWindow.replace(
    /const scrollToBottom = \(behavior: "smooth" \| "auto" = "smooth"\) => \{/,
    `const handlePinnedMessageClick = (messageId: string) => {
    const el = document.getElementById(\`message-\${messageId}\`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Add a highlight effect
      el.classList.add('bg-orange-100', 'dark:bg-orange-900/30', 'transition-colors', 'duration-1000');
      setTimeout(() => {
        el.classList.remove('bg-orange-100', 'dark:bg-orange-900/30');
      }, 2000);
    } else {
      // Message might not be loaded, load it or just scroll to top for now
      // In a full implementation, we would fetch the message context
      console.log('Message not found in DOM:', messageId);
    }
  }

  const scrollToBottom = (behavior: "smooth" | "auto" = "smooth") => {`
  );

  // 3. Add PinnedMessagesBar component before the messages container
  chatWindow = chatWindow.replace(
    /<div \n\s*ref=\{containerRef\}\n\s*onScroll=\{handleScroll\}/,
    `<PinnedMessagesBar roomId={roomId} onMessageClick={handlePinnedMessageClick} currentUserRole={currentUser.role} />
      <div 
        ref={containerRef}
        onScroll={handleScroll}`
  );

  fs.writeFileSync(chatWindowPath, chatWindow, 'utf-8');
  console.log('Patched chat-window.tsx with PinnedMessagesBar');
}
