import { GoogleGenAI } from "@google/genai";

/**
 * Converts raw frontend message history into Gemini SDK format
 */
export function formatHistoryForGemini(frontendHistory = []) {
  return frontendHistory
    .filter((msg) => msg && msg.text) // Ignore empty or invalid messages
    .map((msg) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));
}

export async function sendMessageWithGemini({
  message,
  history = [],
  systemInstruction,
  tool,
}) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  // Format our abstract tool definition into the specific structure
  // required by the Gemini SDK's function declarations.
  const geminiTool = tool
    ? {
        functionDeclarations: [
          {
            name: tool.name,
            description: tool.description,
            parameters: {
              type: "OBJECT",
              properties: {
                vehicleType: {
                  type: "STRING",
                  description: tool.parameters.vehicleType.description,
                },
                age: {
                  type: "NUMBER",
                  description: tool.parameters.age.description,
                },
                requestedPolicy: {
                  type: "STRING",
                  description: tool.parameters.requestedPolicy.description,
                },
              },
              required: ["vehicleType", "age", "requestedPolicy"],
            },
          },
        ],
      }
    : undefined;

  // Use the helper function to properly map { sender, text } -> { role, parts }
  const formattedHistory = formatHistoryForGemini(history);

  const chat = ai.chats.create({
    model: "gemini-3.6-flash", // Use active stable Gemini 2.5 flash model
    config: {
      systemInstruction,
      temperature: 0.7,
      tools: geminiTool ? [geminiTool] : undefined,
    },
    history: formattedHistory,
  });

  const result = await chat.sendMessage({ message });

  // Extract the response parts from Gemini's output
  const responseParts = result.candidates[0]?.content?.parts || [];

  // Search through the response blocks to see if the AI invoked a tool function
  const functionCallSegment = responseParts.find((part) => part.functionCall);
  if (functionCallSegment) {
    return {
      type: "tool_call",
      content: null,
      toolCall: {
        name: functionCallSegment.functionCall.name,
        args: functionCallSegment.functionCall.args,
      },
    };
  }

  // Search through the response blocks to find the text response
  const textSegment = responseParts.find((part) => part.text);

  return {
    type: "text",
    content: textSegment ? textSegment.text : "",
    toolCall: null,
  };
}
