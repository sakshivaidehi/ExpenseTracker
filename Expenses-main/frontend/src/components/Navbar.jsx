import React, { useEffect, useState } from "react";
import API from "../services/api";
import EditProfileModal from "./EditProfileModal";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);

  // Watch for token changes to re-fetch user info
  const token = localStorage.getItem("token");
  useEffect(() => {
    let mounted = true;
    if (token) {
      API.get('/auth/me')
        .then(res => {
          if (mounted && res.data && res.data.user) setUser(res.data.user);
        })
        .catch(() => {
          // silent - user not logged in or token missing
        });
    } else {
      setUser(null);
    }
    return () => { mounted = false; };
  }, [token]);

  function handleLogout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  const name = user?.name || "User";
  const email = user?.email || "";
  const avatar = user?.avatar || null;

  const handleUpdated = (u) => {
    setUser(u);
    try { localStorage.setItem('user', JSON.stringify(u)); } catch {}
  };

  return (
    <>
      <nav className="bg-[#0F172A] text-white px-4 sm:px-6 py-3 flex flex-col sm:flex-row justify-between items-center rounded-2xl gap-2 sm:gap-0">
        <h1 className="font-semibold text-lg mb-2 sm:mb-0">Smart Expense</h1>

        {/* Profile row: profile left, logout right on mobile */}
        <div className="w-full sm:w-auto">
          <div className="flex flex-row items-center w-full">
            <button onClick={() => setEditing(true)} className="flex items-center gap-3 flex-shrink-0">
              {avatar ? (
                <img src={avatar} alt={name} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-sm font-semibold">
                  {name[0].toUpperCase()}
                </div>
              )}
              <div className="text-sm text-left">
                <div className="font-semibold">{name}</div>
                {email && <div className="text-xs text-gray-300">{email}</div>}
              </div>
            </button>
            <div className="flex-grow"></div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm ml-2 flex-shrink-0"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      {editing && <EditProfileModal user={user} onClose={() => setEditing(false)} onUpdated={handleUpdated} />}
    </>
  );
}
