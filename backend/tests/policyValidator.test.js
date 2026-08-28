// backend/tests/policyValidator.test.js
import { describe, it, expect } from "vitest";
import { policyRequestSchema } from "../validators/policyValidator.js";

describe("Policy Request Zod Validator", () => {
  it("should validate a correct policy request", () => {
    const validData = {
      vehicle: { type: "sedan", age: 3 },
      requestedPolicy: "MBI",
    };

    const result = policyRequestSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should reject a request with an invalid vehicle age", () => {
    const invalidData = {
      vehicle: { type: "sedan", age: -1 },
      requestedPolicy: "Comprehensive",
    };

    const result = policyRequestSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("should reject a request with an unsupported policy type", () => {
    const invalidData = {
      vehicle: { type: "sedan", age: 2 },
      requestedPolicy: "CryptoInsurance",
    };

    const result = policyRequestSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
