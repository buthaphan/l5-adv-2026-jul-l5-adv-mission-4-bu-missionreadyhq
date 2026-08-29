import { Router } from "express";
import { getTinaResponse } from "../services/ai/index.js";
import { evaluatePolicyEligibility } from "../utils/rulesEngine.js";

const router = Router();

router.post("/message", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res
        .status(400)
        .json({ success: false, error: "Message is required" });
    }

    // Get the standardized response from our AI service layer
    const aiResponse = await getTinaResponse(message, history || []);

    // Check if the AI decided to run a tool
    if (
      aiResponse.type === "tool_call" &&
      aiResponse.toolCall.name === "evaluate_policy"
    ) {
      const { vehicleType, age, requestedPolicy } = aiResponse.toolCall.args;

      // Execute deterministic rules engine from Epic 1
      const evaluationResult = evaluatePolicyEligibility(
        { type: vehicleType, age },
        requestedPolicy,
      );

      // Return the evaluation output directly so the frontend can present it
      return res.status(200).json({
        success: true,
        data: {
          type: "tool_result",
          toolName: "evaluate_policy",
          result: evaluationResult,
          reply: evaluationResult.eligible
            ? `Great news! Your ${age}-year-old ${vehicleType} is eligible for ${requestedPolicy}.`
            : `Unfortunately, your ${age}-year-old ${vehicleType} is not eligible for ${requestedPolicy}. Reason: ${evaluationResult.reason}`,
        },
      });
    }

    // Standard text response
    return res.status(200).json({
      success: true,
      data: {
        type: "text",
        reply: aiResponse.content, // Much cleaner than textPart.text!
      },
    });
  } catch (error) {
    console.error("Chat error:", error);

    // Check if the error is a Gemini 429 rate limit or quota error
    const isQuotaError =
      error?.status === 429 ||
      error?.message?.includes("429") ||
      error?.message?.includes("Quota exceeded");

    if (isQuotaError) {
      return res.status(200).json({
        success: true,
        data: {
          type: "text",
          reply:
            "Tina is currently receiving high traffic (quota limit reached). Please wait a few seconds and try sending your message again.",
        },
      });
    }

    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
});

export default router;
