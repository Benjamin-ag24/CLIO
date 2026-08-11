import { Router } from "express";
import {
  listKeywords,
  createKeyword,
  deleteKeyword,
} from "../controllers/keywordController.js";
import { verifyToken, checkRole } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", verifyToken, checkRole("admin"), listKeywords);
router.post("/", verifyToken, checkRole("admin"), createKeyword);
router.delete("/:id", verifyToken, checkRole("admin"), deleteKeyword);

export default router;