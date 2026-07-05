
import Expense from "../models/Expense.js";

export const addExpense = async (req, res) => {
    try {
        const { title, amount, category, date, type } = req.body;
        const expense = await Expense.create({
            userId: req.user.id,
            title,
            amount,
            type: type || 'expense',
            category,
            date
        });
        res.json(expense);
    } catch (err) {
        res.status(500).json({ message: "Failed to add expense" });
    }
};


export const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.user.id }).sort({ date: 1 });
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch expenses" });
    }
};


export const deleteExpense = async (req, res) => {
    try {
        const id = req.params.id;
        const deleted = await Expense.findOneAndDelete({ _id: id, userId: req.user.id });
        if (!deleted) return res.status(404).json({ message: "Expense not found" });
        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete expense" });
    }
};

