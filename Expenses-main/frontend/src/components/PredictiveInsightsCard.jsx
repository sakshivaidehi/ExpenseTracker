// client/src/components/PredictiveInsightsCard.jsx
import React from "react";
import { useEffect, useState } from "react";
import API from "../services/api";

export default function PredictiveInsightsCard() {
    const [prediction, setPrediction] = useState(null);
    const [tips, setTips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchInsights() {
            try {
                const { data } = await API.post("/expenses/predict");
                setPrediction(data.prediction);
                setTips(data.tips || []);
            } catch (err) {
                console.log("Prediction API error:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchInsights();
    }, []);

    return (
        <div className="bg-gray-800 rounded-2xl shadow p-4">
            <h2 className="text-lg font-semibold mb-2">Next Month Spend Forecast</h2>

            {loading ? (
                <p className="text-gray-500">Thinking...</p>
            ) : (
                <p className="text-3xl font-bold">{prediction}</p>
            )}

            {tips.length > 0 && (
                <div className="mt-3">
                    <h3 className="font-semibold mb-1">Saving Tips</h3>
                    <ul className="list-disc pl-4 space-y-1 text-sm text-gray-700">
                        {tips.map((tip, i) => (
                            <li key={i}>{tip}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
