import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useLocation } from "react-router-dom";
import API from "../services/api";
import EditProfileModal from "../components/EditProfileModal";

const Navbar = () => {
    // Profile logic from components/Navbar
    const [user, setUser] = useState(null);
    const [editing, setEditing] = useState(false);
    // On mount, check localStorage for user and set immediately
    useEffect(() => {
        let mounted = true;
        // Try to get user from localStorage first for instant UI update
        try {
            const stored = localStorage.getItem('user');
            if (stored) setUser(JSON.parse(stored));
        } catch {}
        // Always fetch latest user from API if token exists
        API.get('/auth/me')
            .then(res => {
                if (mounted && res.data && res.data.user) setUser(res.data.user);
            })
            .catch(() => {});
        // Listen for login/logout in other tabs or after login
        const handleStorage = (e) => {
            if (e.key === 'token' || e.key === 'user') {
                try {
                    const stored = localStorage.getItem('user');
                    if (stored) setUser(JSON.parse(stored));
                    else setUser(null);
                } catch { setUser(null); }
            }
        };
        const handleUserLoggedIn = () => {
            try {
                const stored = localStorage.getItem('user');
                if (stored) setUser(JSON.parse(stored));
                else setUser(null);
            } catch { setUser(null); }
        };
        window.addEventListener('storage', handleStorage);
        window.addEventListener('user-logged-in', handleUserLoggedIn);
        return () => {
            mounted = false;
            window.removeEventListener('storage', handleStorage);
            window.removeEventListener('user-logged-in', handleUserLoggedIn);
        };
    }, []);
    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        window.location.href = "/";
    }
    const name = user?.name || "User";
    const email = user?.email || "";
    const avatar = user?.avatar || null;
    const handleUpdated = (u) => {
        setUser(u);
        try { localStorage.setItem('user', JSON.stringify(u)); } catch {}
    };
    const navLinks = [
        { name: "Home", path: "/" },
        { name: "ContactUs", path: "/about" },
        { name: "Experience", path: "/testimonial" },
        { name: "About", path: "/about" },
    ];

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if (location.pathname !== "/") {
            setIsScrolled(true);
            return;
        }
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [location.pathname]);

    return (
        <nav
            className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${isScrolled
                    ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4"
                    : "py-4 md:py-6"
                }`}
        >
            <Link to="/">
                <img
                    src={assets.logo}
                    alt="logo"
                    className={`h-12 ${isScrolled && "invert opacity-80"}`}
                />
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-4 lg:gap-8">
                {navLinks.map((navLink, index) => (
                    <NavLink
                        key={index}
                        to={navLink.path}
                        className={`group flex flex-col gap-0.5 ${isScrolled ? "text-gray-700" : "text-white"}`}
                        onClick={() => scrollTo(0, 0)}
                    >
                        {navLink.name}
                        <div
                            className={`${isScrolled ? "bg-gray-700" : "bg-white"} h-0.5 w-0 group-hover:w-full transition-all duration-300`}
                        ></div>
                    </NavLink>
                ))}
                {/* Dashboard link only when logged in */}
                {user && (
                    <NavLink
                        to={`/dashboard/${user._id || "1"}`}
                        className={`group flex flex-col gap-0.5 ${isScrolled ? "text-gray-700" : "text-white"}`}
                        onClick={() => scrollTo(0, 0)}
                    >
                        Dashboard
                        <div
                            className={`${isScrolled ? "bg-gray-700" : "bg-white"} h-0.5 w-0 group-hover:w-full transition-all duration-300`}
                        ></div>
                    </NavLink>
                )}
                {/* Profile section from components/Navbar */}
                {user ? (
                    <div className="flex items-center gap-3 ml-4">
                        <button onClick={() => setEditing(true)} className="flex items-center gap-2">
                            {avatar ? (
                                <img src={avatar} alt={name} className="w-8 h-8 rounded-full object-cover" />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm font-semibold">
                                    {name[0].toUpperCase()}
                                </div>
                            )}
                            <span className="font-semibold text-sm">{name}</span>
                        </button>
                        <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg text-sm ml-2">Logout</button>
                    </div>
                ) : (
                    <NavLink to="/login">
                        <button className="bg-black text-white px-8 py-2.5 rounded-full cursor-pointer">
                            Login
                        </button>
                    </NavLink>
                )}
            </div>

            {/* Mobile Menu Icon */}
            <div className="flex items-center gap-3 md:hidden">
                <img
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    src={assets.menuIcon}
                    alt="menu"
                    className={`${isScrolled && "invert"} h-5 cursor-pointer`}
                />
            </div>

            {/* Mobile Full Screen Menu */}
            <div
                className={`fixed top-0 left-0 w-full h-screen bg-white text-gray-800 flex flex-col items-center justify-center gap-6 font-medium transition-all duration-500 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <button
                    className="absolute top-4 right-4"
                    onClick={() => setIsMenuOpen(false)}
                >
                    <img src={assets.closeMenu} alt="close" className="h-6" />
                </button>

                {navLinks.map(navLink => (
                    <NavLink
                        key={navLink.name}
                        to={navLink.path}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        {navLink.name}
                    </NavLink>
                ))}
                {/* Dashboard link only when logged in (mobile) */}
                {user && (
                    <NavLink
                        to={`/dashboard/${user._id || "1"}`}
                        onClick={() => setIsMenuOpen(false)}
                        className="group flex flex-col gap-0.5"
                    >
                        Dashboard
                        <div className="bg-gray-700 h-0.5 w-0 group-hover:w-full transition-all duration-300"></div>
                    </NavLink>
                )}

                {/* Profile section for mobile */}
                {user ? (
                    <div className="flex flex-col items-center gap-2 mt-4">
                        <button onClick={() => setEditing(true)} className="flex items-center gap-2">
                            {avatar ? (
                                <img src={avatar} alt={name} className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-base font-semibold">
                                    {name[0].toUpperCase()}
                                </div>
                            )}
                            <span className="font-semibold text-base">{name}</span>
                        </button>
                        <button onClick={() => { setIsMenuOpen(false); handleLogout(); }} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg text-base mt-2">Logout</button>
                    </div>
                ) : (
                    <NavLink to="/login" onClick={() => setIsMenuOpen(false)}>
                        <button className="bg-black text-white px-8 py-2.5 rounded-full cursor-pointer">
                            Login
                        </button>
                    </NavLink>
                )}
            </div>
            {editing && <EditProfileModal user={user} onClose={() => setEditing(false)} onUpdated={handleUpdated} />}
        </nav>
    );
};

export default Navbar;
