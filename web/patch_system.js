const fs = require('fs');
const path = require('path');

const chatWindowPath = path.join(__dirname, 'src/components/chat/chat-window.tsx');
let chatWindow = fs.readFileSync(chatWindowPath, 'utf-8');

chatWindow = chatWindow.replace(
  /<MessageBubble\n\s*roomId=\{roomId\}/g,
  `{message.message_type === 'system' ? (
                      <div className="flex justify-center w-full my-2">
                        <span className="bg-slate-100 text-slate-500 text-xs px-3 py-1 rounded-full text-center max-w-[80%]">
                          {message.content_original}
                        </span>
                      </div>
                    ) : (
                    <MessageBubble
                      roomId={roomId}`
);

// We also need to close the ternary operator after MessageBubble
chatWindow = chatWindow.replace(
  /participants=\{participants\}\n\s*\/>\n\s*<\/div>/g,
  `participants={participants}
                    />
                    )}
                  </div>`
);

fs.writeFileSync(chatWindowPath, chatWindow, 'utf-8');
console.log('Patched chat-window.tsx to support system messages');
