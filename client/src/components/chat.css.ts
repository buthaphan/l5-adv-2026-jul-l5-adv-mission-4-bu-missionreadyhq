import { style, globalStyle, keyframes } from "@vanilla-extract/css";

// Global reset to ensure clean layout box-sizing
globalStyle("html, body", {
  margin: 0,
  padding: 0,
  fontFamily: "Lato, Helvetica, Arial, sans-serif",
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

export const chatHeader = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "16px 20px",
  backgroundColor: "#3568bd",
  color: "#ffffff",
});

export const headerTitle = style({
  margin: 0,
  fontSize: "1.1rem",
  fontWeight: 700,
});

export const headerSubtitle = style({
  margin: "4px 0 0",
  fontSize: "0.85rem",
  opacity: 0.85,
});

export const status = style({
  display: "flex",
  alignItems: "center",
  gap: "6px",
  fontSize: "0.8rem",
  fontWeight: 600,
});

export const statusDot = style({
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  backgroundColor: "#22c55e",
});

export const unavailableStatusDot = style([
  statusDot,
  {
    backgroundColor: "#dc2626",
  },
]);

// Chat history scrollable viewport
export const chatHistory = style({
  flex: 1,
  overflowY: "auto",
  padding: "16px",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  backgroundColor: "#fafbfc",
});

// Base message bubble style
export const message = style({
  padding: "10px 12px",
  borderRadius: "8px",
  maxWidth: "75%",
  lineHeight: "1.4",
  fontSize: "1rem",
  wordBreak: "break-word",
});

// User variant: aligned right, distinct color
export const userMessage = style([
  message,
  {
    backgroundColor: "#c92632",
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

export const errorMessage = style({
  alignSelf: "center",
  maxWidth: "75%",
  padding: "10px 12px",
  border: "1px solid #f0a3a8",
  borderRadius: "8px",
  backgroundColor: "#fff1f2",
  color: "#8f1824",
  fontSize: "0.9rem",
  lineHeight: "1.4",
  textAlign: "center",
});

// Container for the bottom input and button
export const inputGroup = style({
  display: "flex",
  padding: "10px",
  gap: "12px",
  backgroundColor: "#ffffff",
  borderTop: "1px solid #e1e4e8",
});

// Textarea input field
export const textInput = style({
  flex: 1,
  padding: "10px 12px",
  borderRadius: "8px",
  border: "1px solid #a61f29",
  fontSize: "1rem",
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
    "&:disabled": {
      cursor: "not-allowed",
      opacity: 0.6,
    },
  },
});

// Send button
export const submitButton = style({
  padding: "12px 20px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#a61f29",
  color: "#ffffff",
  fontSize: "0.95rem",
  fontWeight: 600,
  cursor: "pointer",
  transition: "background-color 0.2s ease",
  selectors: {
    "&:hover": {
      backgroundColor: "#a61f29",
    },
    "&:disabled": {
      cursor: "not-allowed",
      opacity: 0.6,
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
