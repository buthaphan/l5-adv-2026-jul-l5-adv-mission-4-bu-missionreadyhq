import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // 1. Import cors

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// 2. Enable CORS for all routes (or configure specific frontend origins later)
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "Server is running smoothly" });
});

const server = app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${port} is already in use.`);
  } else {
    console.error("An unexpected server error occurred:", error);
  }
  process.exit(1);
});
