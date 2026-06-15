import { useState, useEffect } from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import AdminSidebar from "../components/admin/AdminSidebar";
import { useAuthStore } from "../store/authStore"

const AdminLayout = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { pathname } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  // Guard: not logged in → login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Guard: logged in but not admin → home page
  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex bg-[#0A0A0A] text-white">

      {/* ── Desktop Sidebar ─────────────────────────────── */}
      <aside className="hidden lg:flex lg:shrink-0">
        <div className="w-64">
          <AdminSidebar />
        </div>
      </aside>

      {/* ── Mobile Sidebar Overlay ───────────────────────── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Drawer */}
          <aside className="absolute left-0 top-0 h-full w-64 z-50">
            <AdminSidebar onClose={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      {/* ── Main Content Area ────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile Top Bar */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-[#2A2A2A] bg-[#111111]">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#2A2A2A] transition-colors"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          <span
            className="text-[#E85D04] font-bold tracking-widest uppercase text-sm"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Sibzer Admin
          </span>

          {/* Placeholder to balance flex */}
          <div className="w-9" />
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;