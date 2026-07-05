import Expense from "../models/Expense.js";
import OpenAI from "openai";

const cache = {}; // simple in-memory cache

export const predictNextMonth = async (req, res) => {
    try {
        const userId = req.user.id;

        // If cached result exists and is < 24 hours old, return it
        if (cache[userId] && Date.now() - cache[userId].time < 24 * 60 * 60 * 1000) {
            return res.json(cache[userId].data);
        }

        const expenses = await Expense.find({ userId });

        const totalExpense = expenses
            .filter(e => (e.type ?? "expense") === "expense")
            .reduce((sum, e) => sum + (e.amount || 0), 0);

        const prompt = `My total expense last month was ${totalExpense}. Please break down your response into clear points as follows:\n\n1. State my total money expenses last month.\n2. Predict my likely money expenses for next month (give a range and explain the reasoning).\n3. List 4-5 highly actionable, personalized saving tips based on my spending trend, each as a separate point and explained in 1-2 sentences.\n\nFormat your response as:\n\n1. Total Money Expenses: <amount>\n2. Predicted Money Expenses: <amount or range with explanation>\n3. Saving Tips:\n   - <tip one>\n   - <tip two>\n   - <tip three>\n   - <tip four>\n   - <tip five>`;

        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a smart financial advisor." },
                { role: "user", content: prompt }
            ],
            max_tokens: 200,
            temperature: 0.6
        });


        const output = response.choices[0].message.content;


        // Improved parsing: extract points and saving tips as separate fields
        let predictionPoints = [];
        let tips = [];

        // Extract numbered points (1., 2., 3.)
        const numberedPointRegex = /\d+\.\s*([\s\S]*?)(?=\n\d+\.|$)/g;
        let match;
        while ((match = numberedPointRegex.exec(output)) !== null) {
            predictionPoints.push(match[1].trim());
        }

        // Find the "Saving Tips" section (should be in predictionPoints[2])
        if (predictionPoints[2]) {
            // Extract tips as lines starting with - or *
            tips = predictionPoints[2].split(/\n|\r/)
                .filter(line => line.trim().match(/^[-*•]/))
                .map(line => line.replace(/^[-*•]\s*/, '').trim())
                .filter(Boolean);
            // Remove the tips section from predictionPoints
            predictionPoints[2] = predictionPoints[2].split(/Saving Tips:?/i)[0].trim();
        }

        // Replace $ with ₹ in all prediction points and tips
        predictionPoints = predictionPoints.map(p => p.replace(/\$/g, '₹'));
        tips = tips.map(t => t.replace(/\$/g, '₹'));

        const result = { predictionPoints, tips };

        // Save to cache
        cache[userId] = { time: Date.now(), data: result };
        cache[userId].data = result;

        return res.json(result);

    } catch (err) {
        console.error("OpenAI error:", err.status, err.message);

        if (err.status === 429) {
            return res.status(429).json({ message: "Too many requests, please try after a minute." });
        }

        return res.status(500).json({ message: "Prediction failed", error: err.message });
    }
};
