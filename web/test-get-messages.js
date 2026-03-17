import { getMessages } from "./src/app/actions/chat";

async function test() {
  const roomId = "test-room"; // Need a real room ID, but let's just see if it throws immediately
  try {
    const res = await getMessages(roomId);
    console.log(res);
  } catch (e) {
    console.error(e);
  }
}

test();
