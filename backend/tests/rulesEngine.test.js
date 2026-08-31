// backend/tests/rulesEngine.test.js
import { describe, it, expect } from "vitest";
import {evaluatePolicyEligibility} from "../utils/rulesEngine.js";

describe("Insurance Rules Engine (TDD)", () => {
  it("should NOT allow Mechanical Breakdown Insurance (MBI) for trucks", () => {
    const vehicle = { type: "truck", age: 3 };
    const requestedPolicy = "MBI";

    const result = evaluatePolicyEligibility(vehicle, requestedPolicy);
    expect(result.eligible).toBe(false);
  });

  it("should NOT allow Mechanical Breakdown Insurance (MBI) for racing cars", () => {
    const vehicle = { type: "racing car", age: 2 };
    const requestedPolicy = "MBI";

    const result = evaluatePolicyEligibility(vehicle, requestedPolicy);
    expect(result.eligible).toBe(false);
  });

  it("should NOT allow Comprehensive Car Insurance for vehicles 10 years old or older", () => {
    const vehicle = { type: "sedan", age: 10 };
    const requestedPolicy = "Comprehensive";

    const result = evaluatePolicyEligibility(vehicle, requestedPolicy);
    expect(result.eligible).toBe(false);
  });

  it("should allow Comprehensive Car Insurance for vehicles under 10 years old", () => {
    const vehicle = { type: "sedan", age: 5 };
    const requestedPolicy = "Comprehensive";

    const result = evaluatePolicyEligibility(vehicle, requestedPolicy);
    expect(result.eligible).toBe(true);
  });
});
