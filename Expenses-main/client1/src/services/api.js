import axios from "axios";

// Prefer runtime environment variable VITE_API_URL (set in .env), fallback to localhost
const API = axios.create({
    // baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1"


    baseURL: import.meta.env.VITE_API_URL || "https://expenses-ten-phi.vercel.app/api/v1"
});


API.interceptors.request.use(req => {
    const token = localStorage.getItem("token");
    if (token) req.headers.Authorization = token;
    return req;
});

export default API;
