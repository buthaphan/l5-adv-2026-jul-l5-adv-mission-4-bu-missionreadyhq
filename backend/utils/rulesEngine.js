// Define exclusion rules clearly in an array
const exclusionRules = [
  {
    condition: (vehicle, policy) =>
      vehicle.type === "truck" && policy === "MBI",
    reason: "Trucks are not eligible for Mechanical Breakdown Insurance.",
  },
  {
    condition: (vehicle, policy) =>
      vehicle.type === "racing car" && policy === "MBI",
    reason: "Racing cars are not eligible for Mechanical Breakdown Insurance.",
  },
  {
    condition: (vehicle, policy) =>
      policy === "Comprehensive" && vehicle.age >= 10,
    reason:
      "Vehicles 10 years old or older are not eligible for Comprehensive Car Insurance.",
  },
];

const evaluatePolicyEligibility = (vehicle, requestedPolicy) => {
  // Check if the vehicle/policy combo trips any exclusion rule
  for (const rule of exclusionRules) {
    if (rule.condition(vehicle, requestedPolicy)) {
      return {
        eligible: false,
        reason: rule.reason,
      };
    }
  }

  return { eligible: true };
};

export default evaluatePolicyEligibility;
