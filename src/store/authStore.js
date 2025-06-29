import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const { authAPI } = await import("../api/fakestore");
          const response = await authAPI.login(credentials);
          const { token, user } = response.data;

          // Store token in localStorage
          localStorage.setItem("authToken", token);

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });

          return { success: true };
        } catch (error) {
          set({
            isLoading: false,
            error: error.message || "Login failed"
          });
          return {
            success: false,
            error: error.message || "Login failed"
          };
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const { authAPI } = await import("../api/fakestore");
          const response = await authAPI.register(userData);
          const { token, user } = response.data;

          // Store token in localStorage
          localStorage.setItem("authToken", token);

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });

          return { success: true };
        } catch (error) {
          set({
            isLoading: false,
            error: error.message || "Registration failed"
          });
          return {
            success: false,
            error: error.message || "Registration failed"
          };
        }
      },

      logout: () => {
        localStorage.removeItem("authToken");

        // Clear cart data for the current user
        try {
          const authStore = JSON.parse(
            localStorage.getItem("auth-storage") || "{}"
          );
          const user = authStore.state?.user;
          const userId = user?.id || user?.username || "anonymous";

          // Remove user-specific cart data
          const cartKey = `cart-storage-${userId}`;
          localStorage.removeItem(cartKey);

          // Also clear the general cart storage as fallback
          localStorage.removeItem("cart-storage");

          // Clear any other cart-related storage
          Object.keys(localStorage).forEach((key) => {
            if (key.startsWith("cart-storage")) {
              localStorage.removeItem(key);
            }
          });
        } catch (error) {
          console.error("Error clearing cart data on logout:", error);
        }

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        });

        // Trigger a custom event to notify other stores
        window.dispatchEvent(new CustomEvent("userLoggedOut"));
      },

      clearError: () => set({ error: null }),

      // Initialize auth state from localStorage
      initializeAuth: () => {
        const token = localStorage.getItem("authToken");
        if (token) {
          try {
            // Decode the mock token to get user info
            const tokenData = JSON.parse(atob(token));
            const { authAPI } = require("../api/fakestore");

            // Get user data
            authAPI
              .getUser(tokenData.userId)
              .then((response) => {
                set({
                  user: response.data,
                  token,
                  isAuthenticated: true
                });
              })
              .catch(() => {
                // If user not found, clear auth
                localStorage.removeItem("authToken");
                set({
                  user: null,
                  token: null,
                  isAuthenticated: false
                });
              });
          } catch (error) {
            // Invalid token, clear auth
            localStorage.removeItem("authToken");
            set({
              user: null,
              token: null,
              isAuthenticated: false
            });
          }
        }
      }
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

export default useAuthStore;
