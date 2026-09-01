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

    const aiResponse = await getTinaResponse(message, history || []);

    if (
      aiResponse.type === "tool_call" &&
      aiResponse.toolCall?.name === "evaluate_policy"
    ) {
      const { vehicleType, age, requestedPolicy } = aiResponse.toolCall.args;

      const evaluationResult = evaluatePolicyEligibility(
        { type: vehicleType, age },
        requestedPolicy,
      );

      // Pre-format human-readable summary so frontend can present rules engine results directly
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

    return res.status(200).json({
      success: true,
      data: {
        type: "text",
        reply: aiResponse.content,
      },
    });
  } catch (error) {
    console.error("Chat error:", error);

    const isQuotaError =
      error?.status === 429 ||
      error?.message?.includes("429") ||
      error?.message?.includes("Quota exceeded");

    // Convert upstream API quota limits into a 200 payload so chat UI presents retry advice gracefully
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
