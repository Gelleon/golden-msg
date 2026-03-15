
import { writeDebugLog } from "@/app/actions/chat";

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
    await writeDebugLog("DEWIAR CLIENT ERROR: DEWIAR_API_TOKEN is missing");
    return null;
  }

  // Debug: check token format (masking sensitive part)
  const maskedToken = `${token.substring(0, 4)}...${token.substring(token.length - 4)}`;
  await writeDebugLog(`DEWIAR CLIENT: Using token ${maskedToken}, length: ${token.length}`);

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
    
    // Log the actual URL and headers (masked)
    await writeDebugLog(`DEWIAR REQUEST: POST ${DEWIAR_ENDPOINT}?key=${maskedToken}`);
    await writeDebugLog(`DEWIAR BODY: ${JSON.stringify(body)}`);
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      await writeDebugLog(`DEWIAR CLIENT ERROR ${response.status}: ${errorText}`);
      return null;
    }

    const data = await response.json();
    await writeDebugLog(`DEWIAR RESPONSE: ${JSON.stringify(data)}`);
    return data;
  } catch (error) {
    await writeDebugLog(`DEWIAR CLIENT EXCEPTION: ${error instanceof Error ? error.message : String(error)}`);
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
  const prompt = `Translate the following text from ${fromLang} to ${toLang}. Return ONLY the translated text: ${text}`;
  const response = await callDewiar(prompt);

  // Based on the log: {"reaction":"ok", "response":"你好", ...}
  if (response?.response) {
    return response.response.trim();
  }

  if (response?.data?.message) {
    return response.data.message.trim();
  }
  
  if (response?.message) {
    return response.message.trim();
  }

  if (response?.result) {
    return typeof response.result === 'string' ? response.result.trim() : JSON.stringify(response.result);
  }

  return null;
}
