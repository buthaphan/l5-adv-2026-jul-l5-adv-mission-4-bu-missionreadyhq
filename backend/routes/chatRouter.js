import { Router } from "express";
import { processChatMessage } from "../services/chatService.js";

const router = Router();

router.post("/message", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res
        .status(400)
        .json({ success: false, error: "Message is required" });
    }

    const chatData = await processChatMessage(message, history);

    return res.status(200).json({
      success: true,
      data: chatData,
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
