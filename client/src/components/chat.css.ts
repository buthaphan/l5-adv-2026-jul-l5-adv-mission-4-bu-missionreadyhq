import { style, globalStyle, keyframes } from "@vanilla-extract/css";

// Global reset to ensure clean layout box-sizing
globalStyle("html, body", {
  margin: 0,
  padding: 0,
  fontFamily: "Inter, system-ui, sans-serif",
  backgroundColor: "#f4f4f9",
  color: "#333",
});

// Container style for the chat application layout
export const chatContainer = style({
  width: "100%",
  maxWidth: "650px",
  height: "85vh",
  margin: "40px auto",
  background: "#ffffff",
  borderRadius: "12px",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  border: "1px solid #e1e4e8",
});

// Chat history scrollable viewport
export const chatHistory = style({
  flex: 1,
  overflowY: "auto",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  backgroundColor: "#fafbfc",
});

// Base message bubble style
export const message = style({
  padding: "12px 16px",
  borderRadius: "8px",
  maxWidth: "75%",
  lineHeight: "1.5",
  fontSize: "0.95rem",
  wordBreak: "break-word",
});

// User variant: aligned right, distinct color
export const userMessage = style([
  message,
  {
    backgroundColor: "#0066ff",
    color: "#ffffff",
    alignSelf: "flex-end",
    borderBottomRightRadius: "2px",
  },
]);

// AI variant: aligned left, neutral background
export const aiMessage = style([
  message,
  {
    backgroundColor: "#f0f2f5",
    color: "#1a1a1a",
    alignSelf: "flex-start",
    borderBottomLeftRadius: "2px",
  },
]);

// Container for the bottom input and button
export const inputGroup = style({
  display: "flex",
  padding: "16px",
  gap: "12px",
  backgroundColor: "#ffffff",
  borderTop: "1px solid #e1e4e8",
});

// Textarea input field
export const textInput = style({
  flex: 1,
  padding: "12px 16px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  fontSize: "0.95rem",
  fontFamily: "inherit",
  outline: "none",
  resize: "none", // Prevents manual drag-resizing
  minHeight: "24px", // Keeps it compact initially
  maxHeight: "150px", // Keeps it from growing infinitely
  overflowY: "auto",
  transition: "border-color 0.2s ease",
  selectors: {
    "&:focus": {
      borderColor: "#0066ff",
    },
  },
});

// Send button
export const submitButton = style({
  padding: "12px 20px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#0066ff",
  color: "#ffffff",
  fontSize: "0.95rem",
  fontWeight: 600,
  cursor: "pointer",
  transition: "background-color 0.2s ease",
  selectors: {
    "&:hover": {
      backgroundColor: "#0052cc",
    },
  },
});

// Keyframe animation for jumping dots
const bounce = keyframes({
  "0%, 100%": { transform: "translateY(0)" },
  "50%": { transform: "translateY(-4px)" },
});

// Container for typing dots
export const typingIndicator = style({
  display: "inline-flex",
  gap: "4px",
  alignItems: "center",
  padding: "2px 0",
});

// Target individual dots inside the indicator container
globalStyle(`${typingIndicator} span`, {
  display: "inline-block",
  fontSize: "1.2rem",
  lineHeight: 1,
  color: "#6b7280",
  animation: `${bounce} 1s infinite`,
});

// Stagger animation delays for a natural wave effect
globalStyle(`${typingIndicator} span:nth-child(1)`, {
  animationDelay: "0s",
});

globalStyle(`${typingIndicator} span:nth-child(2)`, {
  animationDelay: "0.2s",
});

globalStyle(`${typingIndicator} span:nth-child(3)`, {
  animationDelay: "0.4s",
});
