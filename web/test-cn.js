
const DEWIAR_API_TOKEN = "Dwr_7b822959b2aa0ab49ecca1412746256d57ac5ba364ae837736b5433cc8ee3546";
const DEWIAR_ENDPOINT = "https://dewiar.com/dew_ai/api";

async function callDewiar(message) {
  const body = {
    data: {
      message: message,
      image: "",
      idb: 1770262281,
      session_id: "",
      midnight_clear: "yes"
    }
  };

  const url = `${DEWIAR_ENDPOINT}?key=${DEWIAR_API_TOKEN}`;
  console.log(`[DEWIAR] Calling API...`);
  // console.log(`[DEWIAR] Body:`, JSON.stringify(body));

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
        console.error(`[DEWIAR] API error. Status: ${response.status} ${response.statusText}`);
        return null;
    }

    const rawText = await response.text();
    console.log(`[DEWIAR] Raw response:`, rawText);
    
    let parsed = null;
    try {
        parsed = JSON.parse(rawText);
    } catch {
        parsed = { response: rawText };
    }
    
    return parsed;

  } catch (error) {
    console.error("[DEWIAR] Network exception:", error);
    return null;
  }
}

async function testTranslation(text, fromLang, toLang) {
  const sourceLang = fromLang === "Chinese" ? "Simplified Chinese" : (fromLang === "Russian" ? "Russian language" : fromLang);
  const targetLang = toLang === "Chinese" ? "Simplified Chinese" : (toLang === "Russian" ? "Russian language" : toLang);

  const prompt = `Task: Translate the following text from ${sourceLang} to ${targetLang}.
Instruction: Provide ONLY the translated text in ${targetLang}. Do not include any explanations, prefixes, quotes, or original text.
Text to translate: ${text}`;

  console.log(`--- Testing translation from ${sourceLang} to ${targetLang} ---`);
  console.log(`Prompt: "${prompt}"`);
  
  const response = await callDewiar(prompt);
  
  if (response) {
      console.log("Parsed response:", JSON.stringify(response, null, 2));
  }
}

// Test Russian to Chinese
testTranslation("Привет, как дела?", "Russian", "Chinese");
