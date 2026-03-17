

async function runLoadTest() {
  const roomId = process.argv[2];
  const count = parseInt(process.argv[3] || "100", 10);
  const baseUrl = process.argv[4] || "http://localhost:3000";

  if (!roomId) {
    console.error("Usage: node scripts/load-test-sim.js <roomId> [count] [baseUrl]");
    process.exit(1);
  }

  console.log(`Starting load test: ${count} messages to room ${roomId} at ${baseUrl}`);

  try {
    const response = await fetch(`${baseUrl}/api/test/load`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ roomId, count })
    });

    const text = await response.text();
    console.log(`Status: ${response.status}`);
    try {
      const result = JSON.parse(text);
      console.log("Load Test Result:", result);
    } catch (e) {
      console.log("Non-JSON response:", text.substring(0, 200));
    }
  } catch (error) {
    console.error("Load Test Failed:", error);
  }
}

runLoadTest();
