const fs = require('fs');
const path = require('path');

const chatWindowPath = path.join(__dirname, 'src/components/chat/chat-window.tsx');
let chatWindow = fs.readFileSync(chatWindowPath, 'utf-8');

chatWindow = chatWindow.replace(
  /\} else if \(data\.type === 'new_message'\) \{[\s\S]*?\}/,
  `} else if (data.type === 'new_message') {
           fetchMessages();
        }`
);

fs.writeFileSync(chatWindowPath, chatWindow, 'utf-8');
console.log('Patched chat-window.tsx with new_message handler');
