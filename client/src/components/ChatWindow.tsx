import { useState, useEffect } from "react";
import type { Message } from "../types/chat";
import { sendMessageToAI } from "../services/api";
import * as styles from "./chat.css";

const ChatWindow = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchInitialGreeting = async () => {
      setIsLoading(true);
      try {
        const response = await sendMessageToAI("hello", []);
        if (response.content) {
          setMessages([
            {
              id: Date.now().toString(),
              sender: "ai",
              text: response.content,
            },
          ]);
        }
      } catch (error) {
        console.error("Failed to load initial greeting from Tina:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialGreeting();
  }, []);

  // Inside ChatWindow.tsx handleSend:
  const handleSend = async () => {
    const msg = userInput.trim();
    if (!msg || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: msg,
    };

    // Capture past conversation context BEFORE adding the new message
    const previousHistory = [...messages];

    // Update UI state locally
    setMessages((prev) => [...prev, userMsg]);
    setUserInput("");
    setIsLoading(true);

    try {
      // 3. Pass text as the current message, and previousHistory as history
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // <-- Stops step 2 (inserting \n) from happening
      handleSend();
    }
  };
  return (
    <div className={styles.chatContainer}>
      {/* Message bubbles will live here */}
      <div className={styles.chatHistory}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.message} ${
              msg.sender === "user" ? styles.userMessage : styles.aiMessage
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className={styles.inputGroup}>
        <textarea
          className={styles.textInput}
          placeholder="Type your message... (Shift+Enter for new line)"
          rows={1}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className={styles.submitButton} onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
