import { AIProjectClient } from "@azure/ai-projects";
import { DefaultAzureCredential } from "@azure/identity";

export async function sendMessageWithAzureWorkflow({ message, history = [] }) {
	const endpoint = process.env.PROJECT_ENDPOINT;

	if (!endpoint) {
		throw new Error("Missing PROJECT_ENDPOINT in environment variables.");
	}

	const client = new AIProjectClient(endpoint, new DefaultAzureCredential());

	const openai = client.getOpenAIClient();

	const conversationItems = history
		.map((item) => {
			const role =
				item.role || (item.sender === "user" ? "user" : "assistant");

			const content = item.content || item.message || item.text;

			if (!content) {
				return null;
			}

			return {
				type: "message",
				role,
				content,
			};
		})
		.filter(Boolean);

	const conversation = await openai.conversations.create({
		items: conversationItems,
	});

	// Add the current user message.
	await openai.conversations.items.create(conversation.id, {
		items: [
			{
				type: "message",
				role: "user",
				content: message,
			},
		],
	});

	// Ask Tina to respond using the conversation context.
	const response = await openai.responses.create(
		{
			conversation: conversation.id,
		},
		{
			body: {
				agent_reference: {
					name: "Tina-Car-Insurance-Agent",
					type: "agent_reference",
				},
			},
		},
	);

	const functionCall = response.output.find(
		(item) => item.type === "function_call",
	);

	if (functionCall) {
		return {
			type: "tool_call",
			content: null,
			toolCall: {
				name: functionCall.name,
				args: JSON.parse(functionCall.arguments),
			},
		};
	}

	return {
		type: "text",
		content: response.output_text || "",
		toolCall: null,
	};
}
