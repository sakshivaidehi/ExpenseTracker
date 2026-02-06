import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });
    res.json({ message: "User Registered" });
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token, user: { _id: user._id, name: user.name, email: user.email } });
};

export const me = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: "No user" });
        const user = await User.findById(userId).select('name email avatar');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ user: { name: user.name, email: user.email, avatar: user.avatar } });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch user' });
    }
};

export const updateMe = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'No user' });

        const { name, avatar } = req.body;
        const updated = await User.findByIdAndUpdate(userId, { name, avatar }, { new: true }).select('name email avatar');
        if (!updated) return res.status(404).json({ message: 'User not found' });
        res.json({ user: { name: updated.name, email: updated.email, avatar: updated.avatar } });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update user' });
    }
};

// Get current user details
export const getMe = async (req, res) => {
    try {
        // req.user is set by the authMiddleware
        const user = await User.findById(req.user.id).select("-password"); // Exclude password
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// ... (your existing imports and signup/login functions)

// --- ADD THIS FUNCTION ---
export const logout = (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        });

        return res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

