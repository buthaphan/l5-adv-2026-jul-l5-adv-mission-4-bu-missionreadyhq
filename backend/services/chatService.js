import { getTinaResponse } from "./ai/index.js";
import { evaluatePolicyEligibility } from "../utils/rulesEngine.js";

/**
 * Orchestrates sending user messages to the AI model and executing tools/rules engine when required.
 * Returns a normalized payload structure ready for presentation.
 */
export async function processChatMessage(message, history = []) {
  const aiResponse = await getTinaResponse(message, history);

  // Handle deterministic policy evaluation tool call
  if (
    aiResponse.type === "tool_call" &&
    aiResponse.toolCall?.name === "evaluate_policy"
  ) {
    const { vehicleType, age, requestedPolicy } = aiResponse.toolCall.args;

    const evaluationResult = evaluatePolicyEligibility(
      { type: vehicleType, age },
      requestedPolicy,
    );

    const reply = evaluationResult.eligible
      ? `Great news! Your ${age}-year-old ${vehicleType} is eligible for ${requestedPolicy}.`
      : `Unfortunately, your ${age}-year-old ${vehicleType} is not eligible for ${requestedPolicy}. Reason: ${evaluationResult.reason}`;

    return {
      type: "tool_result",
      toolName: "evaluate_policy",
      result: evaluationResult,
      reply,
    };
  }

  // Handle standard text response
  return {
    type: "text",
    reply: aiResponse.content,
  };
}
