
const DEWIAR_ENDPOINT = "https://dewiar.com/dew_ai/api";
const token = "Dwr_7b822959b2aa0ab49ecca1412746256d57ac5ba364ae837736b5433cc8ee3546";

async function testTranslation(text, fromLang, toLang, index) {
  const sourceLang = fromLang === "Chinese" ? "Simplified Chinese" : (fromLang === "Russian" ? "Russian language" : fromLang);
  const targetLang = toLang === "Chinese" ? "Simplified Chinese" : (toLang === "Russian" ? "Russian language" : toLang);

  const prompt = `Task: Translate the following text from ${sourceLang} to ${targetLang}.
Instruction: Provide ONLY the translated text in ${targetLang}. Do not include any explanations, prefixes, quotes, or original text.
Text to translate: ${text}`;

  console.log(`\n--- LOG ${index}: Translating "${text}" (${fromLang} -> ${toLang}) ---`);
  
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

    console.log(`[DEWIAR] Status: ${response.status} ${response.statusText}`);
    const data = await response.json();
    console.log(`[DEWIAR] Full Response:`, JSON.stringify(data));
    
    const translatedText = 
      data.response || 
      data.data?.message || 
      data.data?.response ||
      data.message || 
      data.choices?.[0]?.message?.content ||
      (typeof data.result === 'string' ? data.result : null);
      
    console.log(`[DEWIAR] Extracted Translation: "${translatedText}"`);
    
    if (!translatedText) {
        console.warn(`[DEWIAR] WARNING: No translation extracted!`);
    }
  } catch (error) {
    console.error(`[DEWIAR] ERROR:`, error.message);
  }
}

async function runTests() {
  await testTranslation("Привет, как дела?", "Russian", "Chinese", 1);
  await testTranslation("你好，你叫什么名字？", "Chinese", "Russian", 2);
  await testTranslation("Сегодня отличная погода для прогулки.", "Russian", "Chinese", 3);
  await testTranslation("谢谢你的帮助，我很感激。", "Chinese", "Russian", 4);
}

runTests();
