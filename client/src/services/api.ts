// src/services/api.ts
import type { AIResponse, Message } from "../types/chat";

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || "/api/chat/message";

export async function sendMessageToAI(
  message: string,
  history: Message[] = [],
): Promise<AIResponse> {
  // Format history to match Gemini's expectations:
  // 1. Map 'user' -> 'user' and 'ai' -> 'model'
  // 2. Ensure parts has a valid non-empty string for 'text'
  const formattedHistory = history.map((msg) => ({
    role: msg.sender === "user" ? "user" : "model",
    parts: [{ text: msg.text || "" }],
  }));

  const response = await fetch(API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, history: formattedHistory }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  const json = await response.json();
  const payload = json.data || {};

  if (payload.type === "tool_result") {
    return {
      type: "tool_call",
      content: payload.reply || null,
      toolCall: {
        name: payload.toolName,
        args: payload.result,
      },
    };
  }

  return {
    type: "text",
    content: payload.reply || null,
    toolCall: null,
  };
}
