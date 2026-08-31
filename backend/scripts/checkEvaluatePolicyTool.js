import { AIProjectClient } from "@azure/ai-projects";
import { DefaultAzureCredential } from "@azure/identity";
import "dotenv/config";

const AGENT_NAME = "Tina-Car-Insurance-Agent";

const project = new AIProjectClient(
  process.env.PROJECT_ENDPOINT,
  new DefaultAzureCredential(),
);

const agent = await project.agents.get(AGENT_NAME);

console.log("Agent:", agent.name);
console.log("Latest version:", agent.versions.latest.version);

console.dir(agent.versions.latest.definition.tools, {
  depth: null,
});
