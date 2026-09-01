import { useState, useRef, useEffect } from "react";
import type { Message } from "../types/chat";
import { sendMessageToAI, checkServiceHealth } from "../services/api";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init-1",
      sender: "ai",
      text: "I'm Tina. I help you to choose right insurance policy. May I ask you a few personal questions to make sure I recommend the best policy for you?",
    },
  ]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isServiceUnavailable, setIsServiceUnavailable] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const conversationEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, errorMsg]);

  const handleSend = async () => {
    const msg = userInput.trim();
    if (!msg || isLoading || isServiceUnavailable) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: msg,
    };

    const previousHistory = [...messages];

    setMessages((prev) => [...prev, userMsg]);
    setUserInput("");
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await sendMessageToAI(msg, previousHistory);
      const responseText = response.content || "I processed that for you!";

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: responseText,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Failed to send message:", error);
      setIsServiceUnavailable(true);
      setErrorMsg(
        "Sorry, I'm unable to respond right now. Please try again in a moment.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = async () => {
    setIsRetrying(true);

    try {
      await checkServiceHealth();
      setIsServiceUnavailable(false);
      setErrorMsg(null);
    } catch (error) {
      console.error("Health check failed:", error);
      setErrorMsg("Tina is still unavailable. Please try again later.");
    } finally {
      setIsRetrying(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return {
    messages,
    userInput,
    setUserInput,
    isLoading,
    errorMsg,
    isServiceUnavailable,
    isRetrying,
    conversationEndRef,
    handleSend,
    handleRetry,
    handleKeyDown,
  };
}
