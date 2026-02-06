import React from "react";  
import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
// import PredictiveInsightsCard from "../components/PredictiveInsightsCard";
import { Link, useParams, useNavigate } from "react-router-dom";
import TransactionChart from "../components/TransactionChart";
// data now comes from backend; dummy data removed
import AddTransactionModal from "../components/AddTransactionModal";

export default function Dashboard() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [expenses, setExpenses] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [allExpenses, setAllExpenses] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [selectedTxn, setSelectedTxn] = useState(null);
    const [allIncomeTotal, setAllIncomeTotal] = useState(0);
    const [allExpenseTotal, setAllExpenseTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 31;

    // 👇 Add metrics for income & expense
    const [incomeTotal, setIncomeTotal] = useState(
        0
    );
    const [expenseTotal, setExpenseTotal] = useState(
        0
    );

    useEffect(() => {
        API.get("/expenses")
            .then(res => {
                if (Array.isArray(res.data)) {
                    setExpenses(res.data);
                    setAllExpenses(res.data);
                    updateTotals(res.data);
                }
            })
            .catch(err => console.log("Fetch error:", err));
    }, []);

    // recompute overall totals when master list changes
    useEffect(() => {
        const income = (allExpenses || []).filter(e => e.type === "income").reduce((a, b) => a + Number(b.amount || 0), 0);
        const expense = (allExpenses || []).filter(e => e.type === "expense").reduce((a, b) => a + Number(b.amount || 0), 0);
        setAllIncomeTotal(income);
        setAllExpenseTotal(expense);
    }, [allExpenses]);

    // Recompute chart data whenever the visible expenses change
    useEffect(() => {
        computeChartData(expenses);
    }, [expenses]);

    // Ensure totals always reflect the currently visible transactions
    useEffect(() => {
        updateTotals(expenses);
    }, [expenses]);

    // Clear selection if selected transaction is filtered out
    useEffect(() => {
        if (selectedTxn && !expenses.find(e => e._id === selectedTxn._id)) {
            setSelectedTxn(null);
        }
    }, [expenses, selectedTxn]);

    // 👇 Function to update totals properly
    function updateTotals(list) {
        const income = (list || []).filter(e => e.type === "income").reduce((a, b) => a + Number(b.amount || 0), 0);
        const expense = (list || []).filter(e => e.type === "expense").reduce((a, b) => a + Number(b.amount || 0), 0);

        setIncomeTotal(income);
        setExpenseTotal(expense);
    }

    // 👇 Handler for adding new transaction
    async function handleAdded(newItem) {
        const updatedList = [newItem, ...expenses];
        setExpenses(updatedList);
        updateTotals(updatedList); // income/expense totals refresh
        setAllExpenses(prev => [newItem, ...prev]);
        computeChartData(updatedList);
        setCurrentPage(1);
    }

    // Delete a transaction (client-side + attempt server call)
    async function handleDelete(id) {
        const ok = window.confirm("Delete this transaction?");
        if (!ok) return;

        // Optimistic update
        setAllExpenses(prev => prev.filter(e => e._id !== id));
        setExpenses(prev => {
            const next = prev.filter(e => e._id !== id);
            computeChartData(next);
            updateTotals(next);
            return next;
        });

        // clear selection if it was the deleted one
        if (selectedTxn && selectedTxn._id === id) setSelectedTxn(null);

        // Try to delete on server if endpoint exists
        try {
            await API.delete(`/expenses/${id}`);
        } catch (err) {
            console.warn("Server delete failed (maybe endpoint not implemented):", err);
        }
    }

    // Compute chart data aggregated by ISO date from the visible expenses
    function computeChartData(list) {
        const byDay = {};
        (list || []).forEach(txn => {
            const key = new Date(txn.date).toISOString().split('T')[0];
            if (!byDay[key]) byDay[key] = { day: key, expense: 0, income: 0 };
            if ((txn.type ?? 'expense') === 'income') byDay[key].income += Number(txn.amount || 0);
            else byDay[key].expense += Number(txn.amount || 0);
        });

        const arr = Object.values(byDay).sort((a, b) => new Date(a.day) - new Date(b.day));
        setChartData(arr);
    }

    // clamp current page when expenses change
    useEffect(() => {
        const totalPages = Math.min(24, Math.max(1, Math.ceil((expenses || []).length / pageSize)));
        if (currentPage > totalPages) setCurrentPage(totalPages);
    }, [expenses]);

    return (
        <div className="min-h-screen bg-[#0F172A] text-white">
            {/* Add margin-top so content starts below the fixed Navbar */}
            <div className="max-w-5xl mx-auto p-6 grid gap-6 mt-24 sm:mt-28">
                {/* Top row: Filter, Add, Forecast */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 items-stretch sm:items-center mb-2 w-full">
                    <select
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val === 'all') {
                                setExpenses(allExpenses);
                                updateTotals(allExpenses);
                                return;
                            }
                            const days = Number(val);
                            const filtered = allExpenses.filter((exp) => {
                                const diff = (new Date() - new Date(exp.date)) / (1000 * 60 * 60 * 24);
                                return diff <= days;
                            });
                            setExpenses(filtered);
                            updateTotals(filtered);
                        }}
                        className="bg-gray-800 rounded-xl px-3 py-2 text-sm text-gray-300 w-full sm:w-40"
                        defaultValue="30"
                    >
                        <option value="30">Last 30 Days</option>
                        <option value="90">Last 90 Days</option>
                        <option value="365">Last 1 Year</option>
                        <option value="all">All time</option>
                    </select>
                    <button
                        onClick={() => setShowAdd(true)}
                        className="bg-green-600 rounded-xl px-4 py-2 font-semibold w-full sm:w-max"
                    >
                        + Add Transaction
                    </button>
                    <Link
                        to={`/dashboard/${userId}/forecast`}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 font-semibold w-full sm:w-max text-center flex items-center justify-center"
                    >
                        See Your Forecast Spend
                    </Link>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-[#1E293B] rounded-2xl p-4 shadow-lg mx-auto w-full max-w-md">
                        <p className="text-sm text-gray-400">Total Transactions</p>
                        <p className="text-2xl font-bold">{expenses.length}</p>
                        <p className="text-xs text-gray-400">All time: {allExpenses.length}</p>
                    </div>
                    <div className="bg-[#1E293B] rounded-2xl p-4 shadow-lg mx-auto w-full max-w-md">
                        <p className="text-sm text-gray-400">Total Expenses</p>
                        <p className="text-2xl font-bold">₹{expenseTotal}</p>
                        <p className="text-xs text-gray-400">All time: ₹{allExpenseTotal}</p>
                    </div>
                    <div className="bg-[#1E293B] rounded-2xl p-4 shadow-lg mx-auto w-full max-w-md">
                        <p className="text-sm text-gray-400">Income</p>
                        <p className="text-2xl font-bold">₹{incomeTotal}</p>
                        <p className="text-xs text-gray-400">All time: ₹{allIncomeTotal}</p>
                    </div>
                </div>

                {/* Chart */}

                                <div className="flex w-full">
                                      <div className="bg-[#1E293B] rounded-2xl p-2 sm:p-4 overflow-x-auto w-full mx-auto max-w-md sm:max-w-4xl">
                                        <TransactionChart data={chartData} selectedTransaction={selectedTxn} transactions={expenses} />
                                    </div>
                                </div>

                {/* Recent Transactions Table */}
                <div className="bg-[#1E293B] rounded-2xl shadow-lg p-5 w-full mx-auto max-w-md sm:max-w-4xl">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-300">Recent Transactions</h2>
                        <p className="text-sm text-gray-400">{expenses.length} total</p>
                    </div>

                    <div className="mt-4 overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead>
                                <tr className="text-left text-sm text-gray-400">
                                    <th className="px-3 py-2">Date</th>
                                    <th className="px-3 py-2">Title</th>
                                    <th className="px-3 py-2">Amount</th>
                                    <th className="px-3 py-2">Type</th>
                                    <th className="px-3 py-2">Delete</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {(() => {
                                    const sorted = (expenses || []).slice().sort((a,b)=> new Date(b.date) - new Date(a.date));
                                    const totalPages = Math.min(24, Math.max(1, Math.ceil((expenses || []).length / pageSize)));
                                    const start = (currentPage - 1) * pageSize;
                                    const pageItems = sorted.slice(start, start + pageSize);
                                    return pageItems.map(e => (
                                        <tr
                                            key={e._id}
                                            onClick={() => setSelectedTxn(e)}
                                            className={`text-sm cursor-pointer hover:bg-gray-800/30 ${selectedTxn?._id === e._id ? 'bg-gray-800/40' : ''}`}
                                        >
                                            <td className="px-3 py-3 text-gray-300">{new Date(e.date).toLocaleDateString()}</td>
                                            <td className="px-3 py-3 text-gray-200">{e.title}</td>
                                            <td className="px-3 py-3 font-semibold">₹{e.amount}</td>
                                            <td className="px-3 py-3">
                                                <span className={`text-xs font-semibold px-2 py-1 rounded ${(e.type ?? 'expense') === 'income' ? 'bg-green-600' : 'bg-red-600'}`}>
                                                    {(e.type ?? 'expense').toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-3 py-3">
                                                <button
                                                    onClick={(ev) => { ev.stopPropagation(); handleDelete(e._id); }}
                                                    className="text-red-400 hover:text-red-600"
                                                    aria-label={`Delete ${e.title}`}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ));
                                })()}
                            </tbody>
                        </table>
                        {/* Pagination */}
                        {expenses.length > pageSize && (
                            <div className="flex gap-2 mt-3">
                                {Array.from({ length: Math.min(24, Math.max(1, Math.ceil(expenses.length / pageSize))) }, (_, i) => i + 1).map(p => (
                                    <button
                                        key={p}
                                        onClick={() => setCurrentPage(p)}
                                        className={`px-3 py-1 rounded ${currentPage === p ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                                    >{p}</button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>


            </div>

            {/* Modal */}
            {showAdd && (
                <AddTransactionModal
                    onClose={() => setShowAdd(false)}
                    onAdded={handleAdded}
                />
            )}
        </div>
    );
}
