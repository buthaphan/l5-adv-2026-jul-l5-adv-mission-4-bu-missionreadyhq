import "dotenv/config";

import { AIProjectClient } from "@azure/ai-projects";
import { DefaultAzureCredential } from "@azure/identity";

const PROJECT_ENDPOINT = process.env.PROJECT_ENDPOINT;
const AGENT_NAME = "Tina-Car-Insurance-Agent";

async function main() {
  const project = new AIProjectClient(
    PROJECT_ENDPOINT,
    new DefaultAzureCredential(),
  );

  console.log("Azure Foundry client created.");

  const openai = project.getOpenAIClient();

  const conversation = await openai.conversations.create();

  console.log("Conversation:", conversation.id);

  const messages = [
    "Yes",
    "I have a 5-year-old SUV.",
    "I want comprehensive coverage.",
  ];

  for (const message of messages) {
    const response = await openai.responses.create(
      {
        conversation: conversation.id,
        input: message,
      },
      {
        body: {
          agent_reference: {
            name: AGENT_NAME,
            type: "agent_reference",
          },
        },
      },
    );

    console.log(`\nUser: ${message}`);
    console.log(`Tina: ${response.output_text}`);
    console.dir(response.output, { depth: null });
  }
}

main().catch((error) => {
  console.error("Foundry test failed:");
  console.error(error);
  process.exit(1);
});
