import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  createAnalysis,
  deleteAnalysis,
  getAnalysisById,
  listAnalysis,
  updateAnalysis,
} from "../controllers/analysisController.js";

const router = Router();

router.use(verifyToken);

router.post("/", createAnalysis);
router.get("/", listAnalysis);
router.get("/:id", getAnalysisById);
router.put("/:id", updateAnalysis);
router.delete("/:id", deleteAnalysis);

export default router;