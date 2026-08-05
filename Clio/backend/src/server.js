// backend/src/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { AppDataSource } from "./config/database.js";
import { verifyToken } from "./authMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import analysisRoutes from "./routes/analysisRoutes.js";
import { createAnalysis } from "./controllers/analysisController.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/analysis", analysisRoutes);
app.post("/api/analyze", verifyToken, createAnalysis);

const startServer = async () => {
  try {
    await AppDataSource.initialize();

    console.log("Database connected successfully");

    app.listen(PORT, () => {
      console.log(`Clio server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

startServer();