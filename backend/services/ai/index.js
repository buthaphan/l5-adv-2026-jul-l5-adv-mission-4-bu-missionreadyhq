import { TINA_SYSTEM_INSTRUCTION } from "../../config/prompts.js";
import { EVALUATE_POLICY_TOOL } from "../../config/tools.js";
import { sendMessageWithGemini } from "./geminiProvider.js";
import { sendMessageWithAzure } from "./azureWorkFlowProvider.js";

/**
 * Helper to retry API calls on 429 rate limits with exponential backoff
 */
async function callWithRetry(fn, maxRetries = 3, delayMs = 2000) {
	for (let i = 0; i < maxRetries; i++) {
		try {
			return await fn();
		} catch (err) {
			const isQuotaError =
				err?.status === 429 ||
				err?.message?.includes("429") ||
				err?.message?.includes("Quota exceeded");

			// If it's not a rate limit error or we ran out of retries, throw it
			if (!isQuotaError || i === maxRetries - 1) {
				throw err;
			}

			console.warn(
				`Gemini 429 rate limited. Retrying attempt ${i + 1}/${maxRetries} after ${delayMs}ms...`,
			);
			await new Promise((resolve) => setTimeout(resolve, delayMs));
			delayMs *= 2; // Exponential delay: 2s, 4s, 8s
		}
	}
}

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

	return await callWithRetry(async () => {
		switch (provider.toLowerCase()) {
			case "gemini":
				return await sendMessageWithGemini(options);
			case "azure_workflow":
			case "azure":
				return await sendMessageWithAzure(options);
			default:
				throw new Error(`Unsupported AI Provider: ${provider}`);
		}
	});
}
