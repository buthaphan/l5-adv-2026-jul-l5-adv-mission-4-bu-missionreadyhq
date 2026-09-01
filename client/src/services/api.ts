import type { AIResponse, Message } from "../types/chat";

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || "/api/chat/message";
const REQUEST_TIMEOUT_MS = 30_000;

const HEALTH_ENDPOINT = import.meta.env.VITE_HEALTH_ENDPOINT || "/health";
const HEALTH_CHECK_TIMEOUT_MS = 5_000;

export async function sendMessageToAI(
  message: string,
  history: Message[] = [],
): Promise<AIResponse> {
  const controller = new AbortController();

  const timeoutId = window.setTimeout(() => {
    controller.abort();
  }, REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, history }),
      signal: controller.signal,
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
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export async function checkServiceHealth(): Promise<void> {
  const controller = new AbortController();

  const timeoutId = window.setTimeout(() => {
    controller.abort();
  }, HEALTH_CHECK_TIMEOUT_MS);

  try {
    const response = await fetch(HEALTH_ENDPOINT, {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Health check failed: ${response.statusText}`);
    }
  } finally {
    window.clearTimeout(timeoutId);
  }
}
