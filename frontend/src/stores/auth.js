import { defineStore } from "pinia";
import { ref, computed } from "vue";
import api from "../api/axios";

const parseStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

export const useAuthStore = defineStore("auth", () => {
  const token = ref(localStorage.getItem("token") || null);
  const user = ref(parseStoredUser());
  const sessionVerified = ref(false);
  const loading = ref(false);
  const error = ref(null);

  const isAuthenticated = computed(() => Boolean(token.value));

  const clearSession = () => {
    token.value = null;
    user.value = null;
    sessionVerified.value = false;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const login = async (email, password) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post("/auth/login", { email, password });
      const data = response.data.data;

      token.value = data.token;
      user.value = {
        id: data.id,
        full_name: data.full_name || "",
        email: data.email,
        role: data.role || "admin",
      };
      sessionVerified.value = true;

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(user.value));

      return response.data;
    } catch (err) {
      error.value =
        err.response?.data?.message || "Login failed. Please check credentials.";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    try {
      if (token.value) {
        await api.post("/auth/logout");
      }
    } catch {
      // Ignore errors on logout
    } finally {
      clearSession();
    }
  };

  const fetchCurrentUser = async () => {
    if (!token.value) return null;
    try {
      const response = await api.get("/auth/me");
      user.value = response.data.data;
      sessionVerified.value = true;
      localStorage.setItem("user", JSON.stringify(user.value));
      return user.value;
    } catch {
      clearSession();
      return null;
    }
  };

  const updateMe = async (payload) => {
    const response = await api.put("/auth/me", payload);
    user.value = response.data.data;
    localStorage.setItem("user", JSON.stringify(user.value));
    return response.data;
  };

  const changePassword = async (payload) => {
    const response = await api.put("/auth/change-password", payload);
    // Backend revokes active token on password change
    clearSession();
    return response.data;
  };

  const forgotPassword = async (email) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  };

  const resetPassword = async (resetToken, password) => {
    const response = await api.put("/auth/reset-password", {
      token: resetToken,
      password,
    });
    return response.data;
  };

  const verifyEmail = async (verifyToken) => {
    const response = await api.get("/auth/verify-email", {
      params: { token: verifyToken },
    });
    return response.data;
  };

  return {
    token,
    user,
    sessionVerified,
    loading,
    error,
    isAuthenticated,
    clearSession,
    login,
    logout,
    fetchCurrentUser,
    updateMe,
    changePassword,
    forgotPassword,
    resetPassword,
    verifyEmail,
  };
});
