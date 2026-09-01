import ReactMarkdown from "react-markdown";
import { useChat } from "../hooks/useChat";
import * as styles from "./chat.css";

const ChatWindow = () => {
  const {
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
  } = useChat();

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
              isRetrying
                ? styles.checkingStatusDot
                : isServiceUnavailable
                  ? styles.unavailableStatusDot
                  : styles.statusDot
            }
            aria-hidden="true"
          />
          <span>
            {isRetrying
              ? "Checking..."
              : isServiceUnavailable
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
            <span>{errorMsg}</span>

            {isServiceUnavailable && (
              <button
                className={styles.retryButton}
                onClick={handleRetry}
                disabled={isRetrying}
              >
                {isRetrying ? "Checking..." : "Try again"}
              </button>
            )}
          </div>
        )}

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
