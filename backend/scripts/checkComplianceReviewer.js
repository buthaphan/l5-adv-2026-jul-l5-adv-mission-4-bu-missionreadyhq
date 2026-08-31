import "dotenv/config";
import { AIProjectClient } from "@azure/ai-projects";
import { DefaultAzureCredential } from "@azure/identity";

async function main() {
  const endpoint = process.env.PROJECT_ENDPOINT;

  if (!endpoint) {
    throw new Error("PROJECT_ENDPOINT is missing.");
  }

  const client = new AIProjectClient(
    endpoint,
    new DefaultAzureCredential(),
  );

  const agent = await client.agents.get("Tina-Compliance-Reviewer");

  console.log("Agent:", agent.name);
  console.log("Latest version:", agent.versions.latest.version);

  console.dir(agent.versions.latest.definition, {
    depth: null,
  });
}

main().catch((error) => {
  console.error("Compliance Reviewer check failed:");
  console.error(error);
  process.exit(1);
});
