

export interface DewiarMessage {
  role: "user" | "assistant" | "system";
  content: string | any[];
}

export interface DewiarRequestOptions {
  model?: string;
  messages: DewiarMessage[];
  stream?: boolean;
  max_tokens?: number;
  temperature?: number;
  provider_api_key?: string;
}

export interface DewiarResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  billing?: {
    request_cost: number;
    balance_remaining: number;
    using_own_key: boolean;
  };
}

const DEWIAR_ENDPOINT = "https://dewiar.com/dew_ai/api";

/**
 * Universal function to call Dewiar API (New format: dew_ai/api)
 */
export async function callDewiar(message: string): Promise<any | null> {
  const token = process.env.DEWIAR_API_TOKEN;
  
  if (!token) {
    console.error("[DEWIAR] CRITICAL: DEWIAR_API_TOKEN is missing in environment variables!");
    return null;
  }

  try {
    const body = {
      data: {
        message: message,
        image: "",
        idb: 1770262281, // Value from user example
        session_id: "",
        midnight_clear: "yes"
      }
    };

    const url = `${DEWIAR_ENDPOINT}?key=${token}`;
    console.log(`[DEWIAR] Calling API for: "${message.substring(0, 50)}..."`);
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[DEWIAR] API error. Status: ${response.status} ${response.statusText}. Body: ${errorText}`);
      return null;
    }

    const rawText = await response.text();
    let parsed: any = null;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      parsed = { response: rawText };
    }

    console.log("[DEWIAR] Response received from API");
    return parsed;
  } catch (error) {
    console.error("[DEWIAR] Network exception:", error);
    return null;
  }
}

/**
 * Helper specifically for translations using the new API format
 */
export async function translateText(
  text: string, 
  fromLang: string, 
  toLang: string
): Promise<string | null> {
  // Use more specific language names for better AI understanding
  const sourceLang = fromLang === "Chinese" ? "Simplified Chinese" : (fromLang === "Russian" ? "Russian language" : fromLang);
  const targetLang = toLang === "Chinese" ? "Simplified Chinese" : (toLang === "Russian" ? "Russian language" : toLang);

  console.log(`[DEWIAR] translateText called with: fromLang="${fromLang}" (${sourceLang}), toLang="${toLang}" (${targetLang})`);
  const prompt = `Task: Translate the following text from ${sourceLang} to ${targetLang}.
Instruction: Provide ONLY the translated text in ${targetLang}. Do not include any explanations, prefixes, quotes, or original text.
Text to translate: ${text}`;

  console.log(`[DEWIAR] Translating from ${sourceLang} to ${targetLang}`);
  const response = await callDewiar(prompt);

  if (!response) {
    console.error("[DEWIAR] No response received from API");
    return null;
  }

  // Log full response structure for debugging (especially for Chinese to Russian)
  if (sourceLang === "Simplified Chinese") {
    console.log("[DEWIAR DEBUG] Chinese to Russian FULL response:", JSON.stringify(response));
  }

  // Handle various response formats from Dewiar API
  const translatedText =
    (typeof response === "string" ? response : null) ||
    response.response ||
    response.message ||
    response.result ||
    response.answer ||
    response.output ||
    response.text ||
    response.data?.message ||
    response.data?.response ||
    response.data?.result ||
    response.data?.answer ||
    response.data?.output ||
    response.data?.text ||
    response.choices?.[0]?.message?.content;

  console.log(`[DEWIAR] Extracted translatedText: "${translatedText}"`);

  if (translatedText) {
    let trimmed = translatedText.trim();
    
    // Remove common LLM prefixes if they appear despite instructions
    const prefixesToRemove = [
      "Перевод:", "Translation:", "Текст:", "Result:",
      "Russian:", "Russian language:", "На русском:",
    ];
    
    for (const prefix of prefixesToRemove) {
      if (trimmed.toLowerCase().startsWith(prefix.toLowerCase())) {
        trimmed = trimmed.substring(prefix.length).trim();
      }
    }

    // Remove potential quotes if the LLM included them despite instructions
    trimmed = trimmed.replace(/^["'«]|["'»]$/g, '');

    // If it just repeated the source text (very common failure mode for some LLMs)
    if (trimmed.toLowerCase() === text.trim().toLowerCase() && text.length > 3) {
      console.warn("[DEWIAR] Translation returned identical text to source. Likely failed.");
      return null;
    }

    return trimmed;
  }

  console.warn("[DEWIAR] Could not find translated text in response keys:", JSON.stringify(Object.keys(response)));
  return null;
}

/**
 * Transcribe audio using Dewiar API
 */
export async function transcribeAudio(
  file: File | Blob | any,
  language: "ru" | "zh"
): Promise<string | null> {
  const token = process.env.DEWIAR_API_TOKEN;
  if (!token) {
    console.error("[DEWIAR] CRITICAL: DEWIAR_API_TOKEN is missing!");
    return null;
  }

  try {
    const formData = new FormData();
    
    // Check if it's a Buffer (Node.js) or Blob/File (Browser/Next.js)
    if (file instanceof Blob || file instanceof File) {
      formData.append("file", file, "voice.webm");
    } else {
      // If it's a stream or other type, try to append as is
      formData.append("file", file);
    }
    
    formData.append("language", language);
    
    // Using the same endpoint as callDewiar but for transcription
    // If there is no specific /transcribe endpoint, we use the main one with special instructions
    // or try a common pattern.
    const url = `https://dewiar.com/dew_ai/api/transcribe?key=${token}`;
    console.log(`[DEWIAR] Transcribing audio, language: ${language}, file size: ${file.size || 'unknown'} bytes`);

    // We'll also try a secondary URL if the first one fails in a common way
    let response;
    try {
      response = await fetch(url, {
        method: "POST",
        body: formData,
        // No Content-Type header - fetch will set it automatically for FormData including boundary
      });
    } catch (fetchError) {
      console.error("[DEWIAR] Fetch exception during transcription:", fetchError);
      return null;
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[DEWIAR] Transcription error: ${response.status} ${response.statusText}. Body: ${errorText}`);
      
      // Fallback: If /transcribe doesn't exist, try the main endpoint if we can
      if (response.status === 404) {
        console.error("[DEWIAR] Endpoint /transcribe NOT FOUND. Trying main endpoint as fallback...");
        
        const fallbackUrl = `https://dewiar.com/dew_ai/api?key=${token}`;
        try {
          const fallbackResponse = await fetch(fallbackUrl, {
            method: "POST",
            body: formData,
          });
          
          if (fallbackResponse.ok) {
            response = fallbackResponse;
            console.log("[DEWIAR] Fallback to main endpoint SUCCESSFUL");
          } else {
            console.error("[DEWIAR] Fallback also failed with status:", fallbackResponse.status);
            return null;
          }
        } catch (fallbackError) {
          console.error("[DEWIAR] Fallback exception:", fallbackError);
          return null;
        }
      } else {
        return null;
      }
    }

    const data = await response.json();
    console.log("[DEWIAR] Transcription API response:", JSON.stringify(data));
    
    const text = data.text || data.transcription || data.data?.text || data.data?.transcription || data.response;
    
    if (!text) {
      console.warn("[DEWIAR] Transcription response empty or missing text field:", JSON.stringify(data));
    }
    
    return text || null;
  } catch (error) {
    console.error("[DEWIAR] Transcription exception:", error);
    return null;
  }
}
