import { NavLink, Link, useNavigate } from "react-router-dom";
import {
    LayoutDashboard, UtensilsCrossed, Tag,
    ShoppingBag, Ticket, Users, LogOut, X, ExternalLink, Mail
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "../../store/authStore"

const iconMap = {
    LayoutDashboard,
    UtensilsCrossed,
    Tag,
    ShoppingBag,
    Ticket,
    Users,
    Mail,
};

const NAV_ITEMS = [
    { label: "Dashboard", path: "/admin", icon: "LayoutDashboard", end: true },
    { label: "Menu Items", path: "/admin/menu", icon: "UtensilsCrossed" },
    { label: "Categories", path: "/admin/categories", icon: "Tag" },
    { label: "Orders", path: "/admin/orders", icon: "ShoppingBag" },
    { label: "Coupons", path: "/admin/coupons", icon: "Ticket" },
    { label: "Users", path: "/admin/users", icon: "Users" },
    { label: "Messages", path: "/admin/messages", icon: "Mail" }
];

/**
 * AdminSidebar — left navigation panel for admin layout
 *
 * Props:
 *   onClose — () => void  (mobile only — closes the drawer)
 */
const AdminSidebar = ({ onClose }) => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="h-full flex flex-col bg-[#0D0D0D] border-r border-[#1A1A1A] w-64">

            {/* ── Header ───────────────────────────────────── */}
            <div className="flex items-center justify-between px-5 py-5
                      border-b border-[#1A1A1A]">
                <span
                    className="text-xl font-bold tracking-wider text-white"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    SIB<span className="text-[#E85D04]">ZER</span>
                    <span className="ml-2 text-[10px] text-gray-600 tracking-widest
                           uppercase align-middle font-normal">
                        Admin
                    </span>
                </span>

                {/* Mobile close button */}
                {onClose && (
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-white
                       hover:bg-[#1A1A1A] transition-colors lg:hidden"
                        aria-label="Close sidebar"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* ── View Site ─────────────────────────────────── */}
            <div className="px-3 pt-3">
                <Link
                    to="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs
                   text-gray-500 hover:text-white hover:bg-[#151515]
                   transition-all duration-200 group"
                >
                    <ExternalLink
                        size={13}
                        className="text-gray-600 group-hover:text-[#E85D04] transition-colors shrink-0"
                    />
                    View Site
                </Link>
            </div>

            {/* ── Nav Items ─────────────────────────────────── */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
                {NAV_ITEMS.map((item) => {
                    const Icon = iconMap[item.icon];
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl
                 text-sm font-medium transition-all duration-200
                 ${isActive
                                    ? "bg-[#E85D04]/10 text-[#E85D04]"
                                    : "text-gray-500 hover:text-gray-200 hover:bg-[#151515]"
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {/* Active indicator bar */}
                                    {isActive && (
                                        <motion.span
                                            layoutId="activeNav"
                                            className="absolute left-0 top-1/2 -translate-y-1/2
                                 w-0.5 h-5 bg-[#E85D04] rounded-full"
                                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                        />
                                    )}

                                    <Icon
                                        size={16}
                                        className={`shrink-0 transition-colors
                                ${isActive ? "text-[#E85D04]" : "text-gray-600 group-hover:text-gray-400"}`}
                                    />
                                    <span>{item.label}</span>
                                </>
                            )}
                        </NavLink>
                    );
                })}
            </nav>

            {/* ── User + Logout ─────────────────────────────── */}
            <div className="border-t border-[#1A1A1A] p-3 space-y-1">

                {/* User info */}
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-[#E85D04]/15 flex items-center
                          justify-center text-[#E85D04] text-sm font-bold shrink-0">
                        {user?.name?.charAt(0)?.toUpperCase() ?? "A"}
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-300 truncate">
                            {user?.name ?? "Admin"}
                        </p>
                        <p className="text-[10px] text-gray-600 truncate">
                            {user?.email ?? ""}
                        </p>
                    </div>
                </div>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                     text-sm text-gray-500 hover:text-red-400 hover:bg-red-400/5
                     transition-all duration-200 group"
                >
                    <LogOut
                        size={16}
                        className="shrink-0 text-gray-600 group-hover:text-red-400 transition-colors"
                    />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;