import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ShoppingBag, Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../../store/authStore"
import { useCartStore } from "../../store/cartStore"
import { NAV_LINKS } from "../../constants";

const Navbar = () => {
    const location = useLocation();
    const { isAuthenticated, user, logout } = useAuthStore();
    const { items, openCart } = useCartStore();

    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);

    const totalItems = items.reduce((s, i) => s + i.qty, 0);
    const isHome = location.pathname === "/";

    // Scroll effect — add background when not at top
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
        setUserMenuOpen(false);
    }, [location.pathname]);

    // Close user dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const navBg = scrolled || !isHome || mobileOpen
        ? "bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#1A1A1A]"
        : "bg-transparent";

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">

                    {/* ── Logo ─────────────────────────────────────── */}
                    <Link
                        to="/"
                        className="shrink-0"
                    >
                        <span
                            className="text-2xl font-bold tracking-wider text-white"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            SIB<span className="text-[#E85D04]">ZER</span>
                        </span>
                    </Link>

                    {/* ── Desktop Nav Links ─────────────────────────── */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {NAV_LINKS.map(({ label, path }) => (
                            <NavLink
                                key={path}
                                to={path}
                                className={({ isActive }) =>
                                    `relative text-sm tracking-widest uppercase font-medium transition-colors duration-200 group
                  ${isActive ? "text-[#E85D04]" : "text-gray-300 hover:text-white"}`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        {label}
                                        {/* Underline indicator */}
                                        <span
                                            className={`absolute -bottom-1 left-0 h-px bg-[#E85D04] transition-all duration-300
                      ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
                                        />
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    {/* ── Right Controls ────────────────────────────── */}
                    <div className="flex items-center gap-2 lg:gap-4">

                        {/* Cart Button */}
                        <button
                            onClick={openCart}
                            className="relative p-2 text-gray-300 hover:text-white transition-colors"
                            aria-label="Open cart"
                        >
                            <ShoppingBag size={20} />
                            <AnimatePresence>
                                {totalItems > 0 && (
                                    <motion.span
                                        key="badge"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="absolute -top-0.5 -right-0.5 min-w-4.5 h-4.5 px-1
                               flex items-center justify-center rounded-full
                               bg-[#E85D04] text-white text-[10px] font-bold leading-none"
                                    >
                                        {totalItems > 99 ? "99+" : totalItems}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>

                        {/* Auth — Desktop */}
                        <div className="hidden lg:block" ref={userMenuRef}>
                            {isAuthenticated ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setUserMenuOpen((v) => !v)}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#2A2A2A]
                               hover:border-[#E85D04]/50 text-sm text-gray-300 hover:text-white
                               transition-all duration-200"
                                    >
                                        <User size={14} />
                                        <span className="max-w-25 truncate">{user?.name?.split(" ")[0]}</span>
                                        <ChevronDown
                                            size={12}
                                            className={`transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`}
                                        />
                                    </button>

                                    <AnimatePresence>
                                        {userMenuOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 6, scale: 0.97 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute right-0 top-full mt-2 w-44 rounded-xl
                                   bg-[#111111] border border-[#2A2A2A] shadow-2xl overflow-hidden"
                                            >
                                                <Link
                                                    to="/profile"
                                                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300
                                     hover:text-white hover:bg-[#1A1A1A] transition-colors"
                                                >
                                                    <User size={14} /> Profile
                                                </Link>
                                                <Link
                                                    to="/orders"
                                                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300
                                     hover:text-white hover:bg-[#1A1A1A] transition-colors"
                                                >
                                                    <ShoppingBag size={14} /> My Orders
                                                </Link>
                                                {user?.role === "admin" && (
                                                    <Link
                                                        to="/admin"
                                                        className="flex items-center gap-3 px-4 py-3 text-sm text-[#E85D04]
                                       hover:bg-[#1A1A1A] transition-colors border-t border-[#2A2A2A]"
                                                    >
                                                        Admin Panel
                                                    </Link>
                                                )}
                                                <button
                                                    onClick={logout}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400
                                     hover:text-red-300 hover:bg-[#1A1A1A] transition-colors
                                     border-t border-[#2A2A2A]"
                                                >
                                                    <LogOut size={14} /> Logout
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Link
                                        to="/login"
                                        className="text-sm text-gray-300 hover:text-white transition-colors
                               tracking-wider uppercase px-3 py-1.5"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="text-sm bg-[#E85D04] hover:bg-[#C44D02] text-white
                               px-4 py-1.5 rounded-full transition-colors tracking-wider uppercase"
                                    >
                                        Join
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setMobileOpen((v) => !v)}
                            className="lg:hidden p-2 text-gray-300 hover:text-white transition-colors"
                            aria-label={mobileOpen ? "Close menu" : "Open menu"}
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.span
                                    key={mobileOpen ? "x" : "menu"}
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                    className="block"
                                >
                                    {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                                </motion.span>
                            </AnimatePresence>
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Mobile Menu ──────────────────────────────────── */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="lg:hidden overflow-hidden border-t border-[#1A1A1A]"
                    >
                        <div className="px-4 py-6 flex flex-col gap-1 bg-[#0A0A0A]">
                            {NAV_LINKS.map(({ label, path }) => (
                                <NavLink
                                    key={path}
                                    to={path}
                                    className={({ isActive }) =>
                                        `px-4 py-3 rounded-lg text-sm tracking-widest uppercase transition-colors
                    ${isActive
                                            ? "bg-[#E85D04]/10 text-[#E85D04]"
                                            : "text-gray-300 hover:text-white hover:bg-[#1A1A1A]"
                                        }`
                                    }
                                >
                                    {label}
                                </NavLink>
                            ))}

                            <div className="mt-4 pt-4 border-t border-[#1A1A1A] flex flex-col gap-2">
                                {isAuthenticated ? (
                                    <>
                                        <Link
                                            to="/profile"
                                            className="px-4 py-3 rounded-lg text-sm text-gray-300 hover:text-white
                                 hover:bg-[#1A1A1A] transition-colors"
                                        >
                                            Profile
                                        </Link>
                                        <Link
                                            to="/orders"
                                            className="px-4 py-3 rounded-lg text-sm text-gray-300 hover:text-white
                                 hover:bg-[#1A1A1A] transition-colors"
                                        >
                                            My Orders
                                        </Link>
                                        {user?.role === "admin" && (
                                            <Link
                                                to="/admin"
                                                className="px-4 py-3 rounded-lg text-sm text-[#E85D04]
                                   hover:bg-[#1A1A1A] transition-colors"
                                            >
                                                Admin Panel
                                            </Link>
                                        )}
                                        <button
                                            onClick={logout}
                                            className="px-4 py-3 rounded-lg text-sm text-red-400 hover:text-red-300
                                 hover:bg-[#1A1A1A] transition-colors text-left"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex gap-3">
                                        <Link
                                            to="/login"
                                            className="flex-1 text-center py-2.5 rounded-full border border-[#2A2A2A]
                                 text-sm text-gray-300 hover:text-white hover:border-[#E85D04]/50
                                 transition-all tracking-wider uppercase"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="flex-1 text-center py-2.5 rounded-full bg-[#E85D04]
                                 hover:bg-[#C44D02] text-white text-sm transition-colors
                                 tracking-wider uppercase"
                                        >
                                            Join
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;