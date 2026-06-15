import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {useAuthStore} from "../store/authStore";

/**
 * useAuth — clean interface for auth actions in components
 *
 * Usage:
 *   const { user, isAuthenticated, isAdmin, login, logout } = useAuth();
 */
const useAuth = () => {
  const navigate = useNavigate();

  const {
    user,
    token,
    isAuthenticated,
    isAdmin,
    login: storeLogin,
    register: storeRegister,
    logout: storeLogout,
    updateUser,
    refreshUser,
  } = useAuthStore();

  // Login with toast feedback and redirect
  const login = async (credentials, redirectTo = "/") => {
    try {
      await storeLogin(credentials);
      toast.success("Welcome back!");
      navigate(redirectTo);
    } catch (err) {
      toast.error(err.message || "Login failed. Please try again.");
      throw err; // re-throw so form can handle loading state
    }
  };

  // Register with toast feedback and redirect
  const register = async (userData, redirectTo = "/") => {
    try {
      await storeRegister(userData);
      toast.success("Account created! Welcome to Sibzer.");
      navigate(redirectTo);
    } catch (err) {
      toast.error(err.message || "Registration failed. Please try again.");
      throw err;
    }
  };

  // Logout with toast and redirect to home
  const logout = () => {
    storeLogout();
    toast.success("Logged out successfully.");
    navigate("/");
  };

  // Update profile with toast feedback
  const updateProfile = async (profileData) => {
    try {
      await refreshUser();
      updateUser(profileData);
      toast.success("Profile updated successfully.");
    } catch (err) {
      toast.error(err.message || "Failed to update profile.");
      throw err;
    }
  };

  return {
    // State
    user,
    token,
    isAuthenticated,
    isAdmin: isAdmin,

    // Actions
    login,
    register,
    logout,
    updateProfile,
    refreshUser,
    updateUser,
  };
};

export default useAuth;