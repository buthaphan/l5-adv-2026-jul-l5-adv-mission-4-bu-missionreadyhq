// backend/services/ai/index.js
import { TINA_SYSTEM_INSTRUCTION } from "../../config/prompts.js";
import { EVALUATE_POLICY_TOOL } from "../../config/tools.js";
import { sendMessageWithGemini } from "./geminiProvider.js";

/**
 * The standard response shape required from ALL AI provider adapters.
 *
 * @typedef {Object} AiResponse
 * @property {'text' | 'tool_call'} type - The type of response generated.
 * @property {string | null} content - The text reply (if type is 'text').
 * @property {{ name: string, args: object } | null} toolCall - The tool execution request (if type is 'tool_call').
 */

/**
 * Gets a response from the configured AI provider.
 *
 * @param {string} userMessage - The message from the user.
 * @param {Array} history - The chat history.
 * @returns {Promise<AiResponse>} The normalized AI response.
 */
export async function getTinaResponse(userMessage, history = []) {
  const provider = process.env.AI_PROVIDER || "gemini";

  const options = {
    message: userMessage,
    history,
    systemInstruction: TINA_SYSTEM_INSTRUCTION,
    tool: EVALUATE_POLICY_TOOL,
  };

  switch (provider.toLowerCase()) {
    case "gemini":
      return await sendMessageWithGemini(options);
    // case 'openai':
    //     return await sendMessageWithOpenAI(options);
    default:
      throw new Error(`Unsupported AI Provider: ${provider}`);
  }
}
