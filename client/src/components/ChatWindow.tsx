import { useState } from "react";
import type { Message } from "../types/chat";
import * as styles from "./chat.css";

const ChatWindow = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", sender: "ai", text: "Hello! How can I help you today?" },
  ]);
  const [userInput, setUserInput] = useState("");

  const handleSend = () => {
    if (!userInput.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: userInput,
    };

    setMessages((prev) => [...prev, userMsg]);
    setUserInput("");
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
