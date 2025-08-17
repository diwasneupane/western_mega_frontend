import axios from "axios";
import Cookies from "js-cookie";

// Configure axios defaults
axios.defaults.baseURL = "";
axios.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth service for handling authentication
export const authService = {
  // Login user
  async login(identifier, password) {
    try {
      const response = await axios.post("/api/auth/login", {
        identifier,
        password,
      });

      if (response.data.success) {
        const { user, token } = response.data.data;

        // Store token in cookie
        Cookies.set("token", token, {
          expires: 7,
          secure: import.meta.env.NODE_ENV === "production",
          sameSite: "strict",
        });

        return { success: true, user, token };
      } else {
        return { success: false, error: response.data.error };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: error.response?.data?.error || "Login failed. Please try again.",
      };
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const token = Cookies.get("token");
      if (!token) {
        return { success: false, error: "No token found" };
      }

      const response = await axios.get("/api/auth/me");
      if (response.data.success) {
        return { success: true, user: response.data.data.user };
      } else {
        return { success: false, error: response.data.error };
      }
    } catch (error) {
      console.error("Get current user error:", error);
      return { success: false, error: "Failed to get user data" };
    }
  },

  // Update password
  async updatePassword(currentPassword, newPassword) {
    try {
      const response = await axios.put("/api/auth/update-password", {
        currentPassword,
        newPassword,
      });

      return {
        success: response.data.success,
        message: response.data.message,
        error: response.data.error,
      };
    } catch (error) {
      console.error("Update password error:", error);
      return {
        success: false,
        error: error.response?.data?.error || "Failed to update password",
      };
    }
  },

  // Logout user
  logout() {
    Cookies.remove("token");
  },
};
