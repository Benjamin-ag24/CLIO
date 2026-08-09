import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  createAnalysis,
  deleteAnalysis,
  listAnalysis,
  updateAnalysis,
} from "../controllers/analysisController.js";

const router = Router();

router.use(verifyToken);

router.post("/", createAnalysis);
router.get("/", listAnalysis);
router.put("/:id", updateAnalysis);
router.delete("/:id", deleteAnalysis);

export default router;
