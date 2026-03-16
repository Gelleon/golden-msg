
const DEWIAR_ENDPOINT = "https://dewiar.com/dew_ai/api";
const token = "Dwr_7b822959b2aa0ab49ecca1412746256d57ac5ba364ae837736b5433cc8ee3546";

async function testTranslation(text, fromLang, toLang) {
  const sourceLang = fromLang === "Chinese" ? "Simplified Chinese" : (fromLang === "Russian" ? "Russian language" : fromLang);
  const targetLang = toLang === "Chinese" ? "Simplified Chinese" : (toLang === "Russian" ? "Russian language" : toLang);

  const prompt = `Task: Translate the following text from ${sourceLang} to ${targetLang}.
Instruction: Provide ONLY the translated text in ${targetLang}. Do not include any explanations, prefixes, quotes, or original text.
Text to translate: ${text}`;

  console.log(`[TEST] Translating: "${text}" from ${sourceLang} to ${targetLang}`);
  
  const body = {
    data: {
      message: prompt,
      image: "",
      idb: 1770262281,
      session_id: "",
      midnight_clear: "yes"
    }
  };

  const url = `${DEWIAR_ENDPOINT}?key=${token}`;
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(body)
    });

    console.log(`[TEST] Status: ${response.status} ${response.statusText}`);
    const data = await response.json();
    console.log("[TEST] Full Response:", JSON.stringify(data, null, 2));
    
    const translatedText = 
      data.response || 
      data.data?.message || 
      data.data?.response ||
      data.message || 
      data.choices?.[0]?.message?.content ||
      (typeof data.result === 'string' ? data.result : null);
      
    console.log(`[TEST] Extracted Translation: "${translatedText}"`);
  } catch (error) {
    console.error("[TEST] Error:", error);
  }
}

// Test Chinese to Russian
testTranslation("你好，今天天气怎么样？", "Chinese", "Russian");
