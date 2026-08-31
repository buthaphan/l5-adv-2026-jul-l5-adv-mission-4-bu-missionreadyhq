import { AIProjectClient } from "@azure/ai-projects";
import { DefaultAzureCredential } from "@azure/identity";
import "dotenv/config";

const project = new AIProjectClient(
  process.env.PROJECT_ENDPOINT,
  new DefaultAzureCredential(),
);

const openAIClient = project.getOpenAIClient();

const workflowName =
  process.env.WORKFLOW_NAME || "Tina-Multi-Agent-Workflow";

console.log("Testing workflow:", workflowName);

// Create a temporary conversation.
const conversation = await openAIClient.conversations.create();

console.log("Conversation:", conversation.id);

// Give Tina enough information that she should need
// to call evaluate_policy.
const message = `
I have a 12-year-old truck.
I want Comprehensive Car Insurance.
Please check whether I am eligible.
`;

console.log("\nSending message...\n");

const response = await openAIClient.responses.create(
  {
    conversation: conversation.id,
    input: message,
  },
  {
    body: {
      agent_reference: {
        name: workflowName,
        type: "agent_reference",
      },
    },
  },
);

console.log("\nResponse output:\n");

for (const item of response.output) {
  console.log("========================================");
  console.dir(item, { depth: null });
  console.log("========================================");
}

console.log("\nResponse text:");
console.log(response.output_text);

console.log("\nResponse ID:");
console.log(response.id);
