import { z } from "zod";

export const policyRequestSchema = z.object({
  vehicle: z.object({
    type: z.string().min(1, "Vehicle type is required"),
    age: z.number().int().nonnegative("Vehicle age must be a valid value"),
  }),
  requestedPolicy: z.enum(
    ["MBI", "Comprehensive", "Third Party Car Insurance"],
    {
      errorMap: () => ({ message: "Invalid or unsupported policy requested" }),
    },
  ),
});
