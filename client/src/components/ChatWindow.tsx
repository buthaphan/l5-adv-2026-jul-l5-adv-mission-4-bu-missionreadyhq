import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import type { Message } from "../types/chat";
import { sendMessageToAI } from "../services/api";
import * as styles from "./chat.css";

const ChatWindow = () => {
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

    // Capture past conversation context BEFORE adding the new message
    const previousHistory = [...messages];

    // Update UI state locally
    setMessages((prev) => [...prev, userMsg]);
    setUserInput("");
    setIsLoading(true);
    setErrorMsg(null);

    try {
      // Pass text as the current message, and previousHistory as history
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
        `Sorry, I'm unable to respond right now. Please try again in a moment.`,
      );
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
      <div className={styles.chatHeader}>
        <div>
          <h1 className={styles.headerTitle}>Tina AI</h1>
          <p className={styles.headerSubtitle}>
            Insurance Recommendation Assistant
          </p>
        </div>

        <div className={styles.status}>
          <span
            className={
              isServiceUnavailable
                ? styles.unavailableStatusDot
                : styles.statusDot
            }
            aria-hidden="true"
          />
          <span>
            {isServiceUnavailable
              ? "Unavailable"
              : isLoading
                ? "Reviewing..."
                : "Online"}
          </span>
        </div>
      </div>
      <div className={styles.chatHistory}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.message} ${
              msg.sender === "user" ? styles.userMessage : styles.aiMessage
            }`}
          >
            {msg.sender === "ai" ? (
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            ) : (
              msg.text
            )}
          </div>
        ))}

        {isLoading && (
          <div className={`${styles.message} ${styles.aiMessage}`}>
            <div className={styles.typingIndicator}>
              <span>•</span>
              <span>•</span>
              <span>•</span>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className={styles.errorMessage} role="alert">
            {errorMsg}
          </div>
        )}
        {/* Empty div for checking for the bottom content */}
        <div ref={conversationEndRef} />
      </div>
      <div className={styles.inputGroup}>
        <textarea
          className={styles.textInput}
          placeholder={
            isServiceUnavailable
              ? "Tina is temporarily unavailable"
              : isLoading
                ? "Tina is reviewing your details..."
                : "Type your message... (Shift+Enter for new line)"
          }
          rows={1}
          value={userInput}
          disabled={isLoading || isServiceUnavailable}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className={styles.submitButton}
          onClick={handleSend}
          disabled={isLoading || isServiceUnavailable}
        >
          {isServiceUnavailable
            ? "Unavailable"
            : isLoading
              ? "Waiting..."
              : "Send"}
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
