import express from "express";
import { getAuditLog } from "../controllers/auditController.js";
import { verifyToken, checkRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/",
  verifyToken,
  checkRole("admin"),
  getAuditLog
);

export default router;