import express from "express";
import { login, logout, signup, getMe } from "../controllers/authController.js"; // Import getMe
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// --- ADD THIS LINE ---
// GET /api/v1/auth/me
router.get("/me", authMiddleware, getMe);

export default router;