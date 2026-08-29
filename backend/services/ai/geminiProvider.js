import { GoogleGenAI } from "@google/genai";

export async function sendMessageWithGemini({
  message,
  history = [],
  systemInstruction,
  tool,
}) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  // Format our abstract tool definition into the specific structure
  // required by the Gemini SDK's function declarations. This tells the
  // model what parameters it needs to extract from the user's conversation
  // before it is allowed to trigger the rules engine.
  const geminiTool = {
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
  };

  // Map frontend/database conversation history format into the exact
  // role/parts structure required by the Gemini API. Because Gemini expects
  // the model's role to be labeled explicitly as 'model' rather than 'assistant',
  // we translate the role and wrap message content into the required parts array.
  const formattedHistory = history.map((item) => ({
    role: item.role === "assistant" ? "model" : "user",
    parts: [{ text: item.content }],
  }));

  const chat = ai.chats.create({
    model: "gemini-3.6-flash",
    config: {
      systemInstruction,
      temperature: 0.7,
      tools: [geminiTool],
    },
    history: formattedHistory,
  });

  const result = await chat.sendMessage({ message });

  // Extract the raw content parts array from Gemini's response structure.
  // A single response can contain a mix of text output, thought processes,
  // or structured function calls, which we parse next to determine our next action.
  const responseParts = result.candidates[0].content.parts;

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

  // Search through the response blocks to find the conversational text segment returned by the AI
  const textSegment = responseParts.find((part) => part.text);

  // Return a structured text response payload back to the client or controller
  return {
    type: "text",
    content: textSegment ? textSegment.text : "",
    toolCall: null,
  };
}
