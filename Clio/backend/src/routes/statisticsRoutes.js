import { Router } from "express";
import { getStatistics } from "../controllers/statisticsController.js";
import { verifyToken, checkRole } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", verifyToken, checkRole("admin"), getStatistics);

export default router;