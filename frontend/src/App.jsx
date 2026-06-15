import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

// Common
import ProtectedRoute from "./components/common/ProtectedRoute";

// ── Public Pages
import Home from "./pages/public/Home";
import Menu from "./pages/public/Menu";
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";

// ── Auth Pages (NO layout — full screen)
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// ── User Pages (protected)
import Checkout from "./pages/public/Checkout";
import Profile from "./pages/user/Profile";
import OrderHistory from "./pages/user/OrderHistory";

// ── Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import ManageMenu from "./pages/admin/ManageMenu";
import ManageOrders from "./pages/admin/ManageOrders";
import ManageCoupons from "./pages/admin/ManageCoupons";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageCategories from "./pages/admin/ManageCategories";
import ManageMessages from "./pages/admin/ManageMessages";

const App = () => {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1A1A1A",
            color: "#FFFFFF",
            border: "1px solid #2A2A2A",
            borderRadius: "8px",
            fontSize: "14px",
          },
          success: { iconTheme: { primary: "#E85D04", secondary: "#FFFFFF" } },
          error: { iconTheme: { primary: "#EF4444", secondary: "#FFFFFF" } },
        }}
      />

      <Routes>

        {/* ── Auth routes — completely standalone, no Navbar ── */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ── Public + protected routes — inside MainLayout ── */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<OrderHistory />} />
          </Route>
        </Route>

        {/* ── Admin routes — inside AdminLayout ── */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="menu" element={<ManageMenu />} />
          <Route path="orders" element={<ManageOrders />} />
          <Route path="coupons" element={<ManageCoupons />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="categories" element={<ManageCategories />} />
          <Route path="/admin/messages" element={<ManageMessages />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </>
  );
};

export default App;