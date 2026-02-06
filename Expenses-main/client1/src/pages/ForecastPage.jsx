
import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function ForecastPage() {
  const { userId } = useParams();
  const [predictionPoints, setPredictionPoints] = useState([]);
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInsights() {
      try {
        const { data } = await API.post("/expenses/predict");
        if (Array.isArray(data.predictionPoints)) {
          setPredictionPoints(data.predictionPoints);
        } else if (typeof data.prediction === 'string') {
          setPredictionPoints([data.prediction]);
        } else {
          setPredictionPoints([]);
        }
        setTips(Array.isArray(data.tips) ? data.tips : []);
      } catch (err) {
        console.log("Prediction API error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchInsights();
  }, []);



  return (
    <div className="min-h-screen w-full bg-linear-to-br from-[#0F172A] to-[#1e293b] text-white flex flex-col">
      {/* Add margin-top so content starts below the fixed Navbar */}
      <div className="flex flex-1 flex-col items-center justify-center w-full p-2 sm:p-4 mt-24 sm:mt-28">
        <div className="bg-gray-900 rounded-3xl shadow-2xl p-4 sm:p-8 w-full max-w-xs sm:max-w-2xl border border-gray-700">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2">
            <span role="img" aria-label="forecast">📈</span>
            Next Month Spend Forecast
          </h2>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <svg className="animate-spin h-8 w-8 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
              <span className="text-gray-400 text-lg">Generating your forecast...</span>
            </div>
          ) : (
            <div className="mb-6">
              {predictionPoints.length > 0 && (
                <>
                  <div className="mb-2">
                    <h3 className="text-base sm:text-lg font-semibold text-green-400 flex items-center gap-2"><span role="img" aria-label="bulb">💡</span>Total Money Expenses</h3>
                    <div className="bg-gray-800 rounded-lg px-3 sm:px-4 py-2 shadow-sm border border-gray-700 flex items-start gap-2">
                      <span>{predictionPoints[0]}</span>
                    </div>
                  </div>
                  {predictionPoints[1] && (
                    <div className="mb-2">
                      <h3 className="text-base sm:text-lg font-semibold text-yellow-400 flex items-center gap-2"><span role="img" aria-label="money">💰</span>Predicted Money Expenses</h3>
                      <div className="bg-gray-800 rounded-lg px-3 sm:px-4 py-2 shadow-sm border border-gray-700 flex items-start gap-2">
                        <span>{predictionPoints[1]}</span>
                      </div>
                    </div>
                  )}
                  {predictionPoints[2] && (
                    <div className="mb-2">
                      <h3 className="text-base sm:text-lg font-semibold text-cyan-400 flex items-center gap-2"><span role="img" aria-label="info">ℹ️</span>Forecast Explanation</h3>
                      <div className="bg-gray-800 rounded-lg px-3 sm:px-4 py-2 shadow-sm border border-gray-700 flex items-start gap-2">
                        <span>{predictionPoints[2]}</span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
          {tips.length > 0 && (
            <div className="mt-4">
              <h3 className="text-base sm:text-lg font-semibold mb-2 text-blue-400 flex items-center gap-2"><span role="img" aria-label="tips">📝</span>Saving Tips</h3>
              <ul className="list-disc pl-4 sm:pl-6 space-y-2 text-sm sm:text-base">
                {tips.map((tip, i) => (
                  <li key={i} className="bg-gray-800 rounded-lg px-3 sm:px-4 py-2 border border-gray-700 flex items-start gap-2">
                    <span className="mt-1 text-blue-400">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex flex-col sm:flex-row justify-end mt-8 gap-2">
            <Link to={`/dashboard/${userId}`} className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 rounded-xl font-semibold shadow-lg transition text-center">Back to Dashboard</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
