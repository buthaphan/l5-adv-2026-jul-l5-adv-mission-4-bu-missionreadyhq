import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../server.js";

describe("POST /api/policies/evluate-policy", () => {
  it("should return eligible: false when MBI is requested for a truck", async () => {
    const response = await request(app)
      .post("/api/policies/evaluate-policy")
      .send({
        vehicle: { type: "truck", age: 3 },
        requestedPolicy: "MBI",
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.eligible).toBe(false); // Changed from allowed to eligible
  });

  it("should return a 400 error when the payload fails Zod validation", async () => {
    const response = await request(app)
      .post("/api/policies/evaluate-policy")
      .send({
        vehicle: { type: "", age: -5 }, // Invalid data
        requestedPolicy: "FakePolicy", // Invalid policy
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("Invalid request payload");
  });
});
