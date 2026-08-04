// backend/src/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { verifyToken } from "./authMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import analysisRoutes from "./routes/analysisRoutes.js";
import { createAnalysis } from "./controllers/analysisController.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/analysis", analysisRoutes);
app.post("/api/analisar", verifyToken, createAnalysis);

app.listen(PORT, () => {
  console.log(`✅ Servidor Clio corriendo en http://localhost:${PORT}`);
});
