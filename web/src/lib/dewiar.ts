

export interface DewiarMessage {
  role: "user" | "assistant" | "system";
  content: string | unknown[];
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
const DEWIAR_ERROR_SIGNATURES = [
  "openai token missing",
  "no translation",
  "api key missing",
  "invalid_api_key",
  "unauthorized",
]

/**
 * Universal function to call Dewiar API (New format: dew_ai/api)
 */
export async function callDewiar(message: string): Promise<unknown | null> {
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
    console.log(`[DEWIAR] Request body:`, JSON.stringify(body));
    
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
      throw new Error(`Dewiar API error: ${response.status} ${response.statusText}`);
    }

    const rawText = await response.text();
    console.log(`[DEWIAR] Raw response from API:`, rawText);
    
    // Add custom handling for common error indicators in the text
    const rawLower = rawText.toLowerCase()
    if (
      (rawLower.includes("error") && rawText.length < 200) ||
      DEWIAR_ERROR_SIGNATURES.some((signature) => rawLower.includes(signature))
    ) {
      console.warn("[DEWIAR] API returned text containing 'error'");
      throw new Error(`API returned error: ${rawText}`);
    }

    let parsed: unknown = null;
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

  const responseObject =
    typeof response === "object" && response !== null
      ? (response as Record<string, unknown>)
      : null
  const responseData =
    responseObject && typeof responseObject.data === "object" && responseObject.data !== null
      ? (responseObject.data as Record<string, unknown>)
      : null
  const responseChoices = Array.isArray(responseObject?.choices)
    ? (responseObject?.choices as Array<Record<string, unknown>>)
    : []
  const firstChoice = responseChoices[0]
  const choiceMessage =
    firstChoice && typeof firstChoice.message === "object" && firstChoice.message !== null
      ? (firstChoice.message as Record<string, unknown>)
      : null

  const pickString = (value: unknown) => (typeof value === "string" ? value : null)
  const translatedText =
    pickString(response) ||
    pickString(responseObject?.response) ||
    pickString(responseObject?.message) ||
    pickString(responseObject?.result) ||
    pickString(responseObject?.answer) ||
    pickString(responseObject?.output) ||
    pickString(responseObject?.text) ||
    pickString(responseObject?.translation) ||
    pickString(responseObject?.transcription) ||
    pickString(responseData?.message) ||
    pickString(responseData?.response) ||
    pickString(responseData?.result) ||
    pickString(responseData?.answer) ||
    pickString(responseData?.output) ||
    pickString(responseData?.text) ||
    pickString(responseData?.translation) ||
    pickString(responseData?.transcription) ||
    pickString(choiceMessage?.content) ||
    pickString(responseObject?.data)

  console.log(`[DEWIAR] Extracted translatedText: "${translatedText}"`);

  if (translatedText) {
      let trimmed = translatedText.trim();
      
      // Log for debugging
      console.log(`[DEWIAR] Final extracted translatedText: "${trimmed}"`);

      // Special case: if it returned a common error message as text
      const normalized = trimmed.toLowerCase()
      if (
        normalized.includes("limit") ||
        normalized.includes("token") ||
        normalized.includes("error") ||
        DEWIAR_ERROR_SIGNATURES.some((signature) => normalized.includes(signature))
      ) {
        console.warn(`[DEWIAR] Extracted text looks like an error message: ${trimmed}`);
        return null;
      }

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
    // Relaxed check: Only fail if text is long enough to be unlikely to be identical (e.g. sentences)
    // and if it doesn't look like a number or symbol string
    if (trimmed.toLowerCase() === text.trim().toLowerCase() && text.length > 20 && !/^\d+$/.test(text)) {
      console.warn("[DEWIAR] Translation returned identical text to source. Suspected failure, but returning anyway for safety.");
      // return null; // We allow it now, just warn
    }

    return trimmed;
  }

  console.warn(
    "[DEWIAR] Could not find translated text in response keys:",
    JSON.stringify(responseObject ? Object.keys(responseObject) : [])
  );
  return null;
}

/**
 * Transcribe audio using Dewiar API
 */
export async function transcribeAudio(
  file: Blob | string,
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
    if (file instanceof Blob) {
      formData.append("file", file, "voice.webm");
    } else if (typeof file === "string") {
      formData.append("file", file);
    } else {
      console.error("[DEWIAR] Unsupported audio payload type");
      return null;
    }
    
    formData.append("language", language);
    
    // Using the same endpoint as callDewiar but for transcription
    // If there is no specific /transcribe endpoint, we use the main one with special instructions
    // or try a common pattern.
    const url = `https://dewiar.com/dew_ai/api/transcribe?key=${token}`;
    const fileSize = file instanceof Blob ? file.size : "unknown"
    console.log(`[DEWIAR] Transcribing audio, language: ${language}, file size: ${fileSize} bytes`);

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
            const rawResponse = await fallbackResponse.text();
            console.log("[DEWIAR] Fallback to main endpoint SUCCESSFUL. Raw response:", rawResponse);
            let fallbackData;
            try {
              fallbackData = JSON.parse(rawResponse);
            } catch {
              fallbackData = { response: rawResponse };
            }
            const fallbackText = fallbackData.text || fallbackData.transcription || fallbackData.data?.text || fallbackData.data?.transcription || fallbackData.response || (typeof fallbackData === 'string' ? fallbackData : null);
            return fallbackText || null;
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

    const rawText = await response.text();
    console.log("[DEWIAR] Transcription API response raw:", rawText);
    let data;
    try {
      data = JSON.parse(rawText);
    } catch {
      data = { response: rawText };
    }
    
    const text = data.text || data.transcription || data.data?.text || data.data?.transcription || data.response || (typeof data === 'string' ? data : null);
    
    if (!text) {
      console.warn("[DEWIAR] Transcription response empty or missing text field:", JSON.stringify(data));
    }
    
    return text || null;
  } catch (error) {
    console.error("[DEWIAR] Transcription exception:", error);
    return null;
  }
}
