import API from "../services/api";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const handleSignup = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const payload = Object.fromEntries(formData);

        try {
            setLoading(true);
            await API.post("/auth/signup", payload);

            // Auto-login after signup so UI shows name immediately
            const { data } = await API.post('/auth/login', {
                email: payload.email,
                password: payload.password
            });

            if (data?.token) {
                localStorage.setItem('token', data.token);
                if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
                // Notify all Navbars in this tab
                window.dispatchEvent(new Event('user-logged-in'));
                // Redirect to dashboard with userId param
                if (data.user && data.user._id) {
                    navigate(`/dashboard/${data.user._id}`);
                } else {
                    navigate('/dashboard/unknown');
                }
                return;
            }

            alert("Account created successfully ✔ Please login.");
            navigate("/login"); // fallback to login
        } catch (err) {
            console.log("Signup error:", err);
            alert("Signup failed, maybe email already used!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0F172A] to-[#1e293b] p-2">
            <form onSubmit={handleSignup} className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-700">
                <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center">Create Account</h2>

                <input
                    name="name"
                    placeholder="Your Name"
                    className="border p-2 w-full mb-3 rounded-lg text-sm"
                    required
                />

                <input
                    name="email"
                    placeholder="Email"
                    className="border p-2 w-full mb-3 rounded-lg text-sm"
                    required
                />

                <input
                    name="password"
                    placeholder="Password"
                    type="password"
                    className="border p-2 w-full mb-4 rounded-lg text-sm"
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                    className={`bg-black text-white p-2 w-full rounded-lg ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                    {loading ? (
                        <div className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                            </svg>
                            <span>Creating account...</span>
                        </div>
                    ) : (
                        'Signup'
                    )}
                </button>
            </form>
        </div>
    );
}
