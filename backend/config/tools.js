export const EVALUATE_POLICY_TOOL = {
  name: "evaluate_policy",
  description:
    "Check if a vehicle is eligible for a specific insurance policy based on backend rules.",
  parameters: {
    vehicleType: {
      type: "string",
      description: "Vehicle type, e.g., car or truck",
      required: true,
    },
    age: {
      type: "number",
      description: "Age of the vehicle in years",
      required: true,
    },
    requestedPolicy: {
      type: "string",
      description: "Policy type: MBI, Comprehensive, or Third Party",
      required: true,
    },
  },
};
