const fs = require('fs');
const path = require('path');

// Fix pinned-messages-bar.tsx
const pinnedBarPath = path.join(__dirname, 'src/components/chat/pinned-messages-bar.tsx');
let pinnedBar = fs.readFileSync(pinnedBarPath, 'utf-8');
pinnedBar = pinnedBar.replace(/t\.chat\?\.pinnedMessage/g, 't("chat.pinnedMessage")');
fs.writeFileSync(pinnedBarPath, pinnedBar, 'utf-8');

// Fix message-bubble.tsx
const bubblePath = path.join(__dirname, 'src/components/chat/message-bubble.tsx');
let bubble = fs.readFileSync(bubblePath, 'utf-8');
bubble = bubble.replace(/t\.chat\?\.pin/g, 't("chat.pin")');
bubble = bubble.replace(/t\.chat\?\.unpin/g, 't("chat.unpin")');
bubble = bubble.replace(/t\.chat\?\.copy/g, 't("chat.copy")');
fs.writeFileSync(bubblePath, bubble, 'utf-8');

console.log('Fixed translation calls');
