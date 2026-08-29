import { style, globalStyle } from "@vanilla-extract/css";

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
