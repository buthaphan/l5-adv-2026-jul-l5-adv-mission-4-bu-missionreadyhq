import { AIProjectClient } from "@azure/ai-projects";
import { DefaultAzureCredential } from "@azure/identity";

function needsComplianceReview(message) {
	const reviewKeywords = [
		"claim",
		"claims",
		"excess",
		"windscreen",
		"windshield",
		"deductible",
		"coverage",
		"cover",
		"liability",
		"policy",
	];

	const lowerMessage = message.toLowerCase();

	return reviewKeywords.some((keyword) => lowerMessage.includes(keyword));
}

async function sendToComplianceReviewer({ client, message, draft }) {
	const openai = client.getOpenAIClient();

	const conversation = await openai.conversations.create({
		items: [
			{
				type: "message",
				role: "user",
				content: `Customer question:
${message}

Tina's draft response:
${draft}

Review Tina's response against the available insurance knowledge base. Return ONLY the final customer-facing response.`,
			},
		],
	});

	const response = await openai.responses.create(
		{
			conversation: conversation.id,
		},
		{
			body: {
				agent_reference: {
					name: "Tina-Compliance-Reviewer",
					type: "agent_reference",
				},
			},
		},
	);

	return response.output_text || draft;
}

export async function sendMessageWithAzure({ message, history = [] }) {
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

	await openai.conversations.items.create(conversation.id, {
		items: [
			{
				type: "message",
				role: "user",
				content: message,
			},
		],
	});

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

	const draft = response.output_text || "";

	if (needsComplianceReview(message)) {
		const reviewedResponse = await sendToComplianceReviewer({
			client,
			message,
			draft,
		});

		return {
			type: "text",
			content: reviewedResponse,
			toolCall: null,
		};
	}

	return {
		type: "text",
		content: draft,
		toolCall: null,
	};
}
