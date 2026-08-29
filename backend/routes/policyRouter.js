import { Router } from "express";
import { policyRequestSchema } from "../validators/policyValidator.js";
import { evaluatePolicyEligibility } from "../utils/rulesEngine.js";

const router = Router();

router.post("/evaluate-policy", (req, res) => {
  // Validate incoming payload structure and types using Zod schema contract
  const validationResult = policyRequestSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      error: "Invalid request payload",

      // Flattening or passing Zod formatting issues makes debugging client requests trivial
      details: validationResult.error,
    });
  }

  // Extract strictly typed, validated properties
  const { vehicle, requestedPolicy } = validationResult.data;

  // Execute core business logic via the deterministic rules engine
  const evaluation = evaluatePolicyEligibility(vehicle, requestedPolicy);

  return res.status(200).json({
    success: true,
    data: evaluation,
  });
});

export default router;
