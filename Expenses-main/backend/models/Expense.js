import mongoose from "mongoose";
const expenseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: String,
    amount: Number,
    type: { type: String, default: "expense" },
    category: String,
    date: Date
}, { timestamps: true });
export default mongoose.model("Expense", expenseSchema);
