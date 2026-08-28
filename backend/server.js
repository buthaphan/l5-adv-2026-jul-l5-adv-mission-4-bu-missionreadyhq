import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import policyRouter from "./routes/policyRouter.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/policies", policyRouter);

app.get("/health", (req, res) => {
  res.json({ status: "Server is running smoothly" });
});

export default app;
