import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path"; // If you use path
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import expenseRoutes from "./routes/expense.js";
// ... other imports

const app = express();

// --- FIX START: Robust CORS Configuration ---
// Allow configuring allowed origins via env var `ALLOWED_ORIGINS` (comma-separated)
const defaultAllowed = [
    "http://localhost:5173",
    "https://expenses-frontend-indol.vercel.app"
];
const allowedOriginsRaw = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim())
    : defaultAllowed;
// normalize: strip trailing slash and lowercase for robust comparison
const allowedOrigins = allowedOriginsRaw.map(o => o.replace(/\/+$/,'').toLowerCase());

// Explicit CORS middleware: respond to preflight (OPTIONS) with 204 and set required headers
app.use((req, res, next) => {
    const origin = req.headers.origin;
    console.log('CORS check, incoming origin=', origin);
    const originNormalized = origin ? origin.replace(/\/+$/,'').toLowerCase() : '';
    console.log('CORS normalized origin=', originNormalized, 'allowed=', allowedOrigins);
    // Allow requests with no origin (curl, mobile apps)
    if (!origin) return next();

    if (allowedOrigins.includes(originNormalized)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With');

        if (req.method === 'OPTIONS') return res.sendStatus(204);

        return next();
    }

    console.log('Blocked by CORS (not in allowedOrigins):', origin);
    return res.status(403).send('CORS Denied');
});
// --- FIX END ---

app.use(express.json());
app.use(cookieParser());

// Mount API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/expenses', expenseRoutes);

// Test Route
app.get("/", (req, res) => {
    res.send("API is running successfully");
});

const PORT = process.env.PORT || 5000;

// Connect to DB first, then start server (local dev). Export app for serverless/Vercel.
connectDB()
    .then(() => {
        console.log("Database connected");
        if (process.env.NODE_ENV !== 'production') {
            app.listen(PORT, () => {
                console.log(`Server running on port ${PORT}`);
            });
        }
    })
    .catch((err) => {
        console.error("Failed to connect to database:", err);
        process.exit(1);
    });

export default app;