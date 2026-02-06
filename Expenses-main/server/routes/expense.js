import express from "express";
import { addExpense, getExpenses, deleteExpense } from "../controllers/expenseController.js";
import { predictNextMonth } from "../controllers/geminiPredictController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, addExpense);
router.get("/", authMiddleware, getExpenses);
router.post("/predict", authMiddleware, predictNextMonth);
router.delete("/:id", authMiddleware, deleteExpense);

export default router;
