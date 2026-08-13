import express from "express";

import {
  getUsers,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

import {
  verifyToken,
  checkRole,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);
router.use(checkRole("admin"));

router.get("/", getUsers);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

export default router;