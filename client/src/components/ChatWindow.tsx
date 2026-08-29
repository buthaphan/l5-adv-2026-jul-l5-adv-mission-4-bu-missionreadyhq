import * as styles from './chat.css';

const ChatWindow = () => {
  return (
    <div className={styles.chatContainer}>
      {/* Message bubbles will live here */}
      <div className={styles.chatHistory}>
        <h1>Hello</h1>
      </div>
      <div className={styles.inputGroup}>
        <textarea
          className={styles.textInput}
          placeholder="Type your message... (Shift+Enter for new line)"
          rows={1}
        />
        <button className={styles.submitButton}>Send</button>
      </div>
    </div>
  );
}

export default ChatWindow
