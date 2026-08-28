import { Router } from "express";
import { policyRequestSchema } from "../validators/policyValidator.js";
import evaluatePolicyEligibility from "../utils/rulesEngine.js";

const router = Router();

router.post("/evaluate-policy", (req, res) => {
  const validationResult = policyRequestSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      error: "Invalid request payload",
      details: validationResult.error,
    });
  }

  const { vehicle, requestedPolicy } = validationResult.data;
  const evaluation = evaluatePolicyEligibility(vehicle, requestedPolicy);

  return res.status(200).json({
    success: true,
    data: evaluation,
  });
});

export default router;
