import React from "react";  
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ForecastPage from "./pages/ForecastPage";
import Hero from "./hero/Hero";
import Footer from "./hero/Footer";
import Navbar from "./hero/Navbar";
import Testimonial from "./hero/Testimonial";
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
}

export default function App() {
  // Force Navbar to re-mount when token changes
  const token = localStorage.getItem("token");
  return (
    <>
      <BrowserRouter>
        <Navbar key={token} />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/testimonial" element={<Testimonial />} />
          <Route path="/about" element={<Footer />} />
          <Route
            path="/dashboard/:userId"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/:userId/forecast"
            element={
              <PrivateRoute>
                <ForecastPage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </>
  );
}
