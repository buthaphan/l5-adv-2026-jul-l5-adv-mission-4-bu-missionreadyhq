import { AIProjectClient } from "@azure/ai-projects";
import { DefaultAzureCredential } from "@azure/identity";
import "dotenv/config";

const AGENT_NAME = "Tina-Car-Insurance-Agent";

const project = new AIProjectClient(
  process.env.PROJECT_ENDPOINT,
  new DefaultAzureCredential(),
);

// Get the current agent definition.
const agent = await project.agents.get(AGENT_NAME);

const currentDefinition = agent.versions.latest.definition;

console.log("Current agent version:", agent.versions.latest.version);
console.log("Current tools:", currentDefinition.tools);

// Define the deterministic eligibility function tool.
const evaluatePolicyTool = {
  type: "function",
  name: "evaluate_policy",
  description:
    "Check if a vehicle is eligible for a specific insurance policy based on backend rules.",
  parameters: {
    type: "object",
    properties: {
      vehicleType: {
        type: "string",
        description: "Vehicle type, for example car, SUV, truck, or racing car.",
      },
      age: {
        type: "number",
        description: "Age of the vehicle in years.",
      },
      requestedPolicy: {
        type: "string",
        description:
          "Policy type: MBI, Comprehensive, or Third Party.",
      },
    },
    required: ["vehicleType", "age", "requestedPolicy"],
    additionalProperties: false,
  },
  strict: true,
};

// Make sure we don't add the function twice.
const existingTools = currentDefinition.tools || [];

const alreadyExists = existingTools.some(
  (tool) =>
    tool.type === "function" &&
    tool.name === "evaluate_policy",
);

if (alreadyExists) {
  console.log("evaluate_policy is already configured.");
  process.exit(0);
}

// Preserve the existing agent definition and add our function.
const updatedDefinition = {
  kind: currentDefinition.kind,
  model: currentDefinition.model,
  instructions: currentDefinition.instructions,
  tools: [...existingTools, evaluatePolicyTool],
};

// Create a new version of the EXISTING agent.
const newVersion = await project.agents.createVersion(
  AGENT_NAME,
  updatedDefinition,
);

console.log("New agent version created:");
console.log({
  id: newVersion.id,
  name: newVersion.name,
  version: newVersion.version,
  status: newVersion.status,
});
