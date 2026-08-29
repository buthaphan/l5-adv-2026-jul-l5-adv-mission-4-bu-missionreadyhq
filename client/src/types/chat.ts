export type AIResponse = {
  type: "text" | "tool_call";
  content: string | null;
  toolCall: {
    name: string;
    args: Record<string, any>;
  } | null;
};

export interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
}
