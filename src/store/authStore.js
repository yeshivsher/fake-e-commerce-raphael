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
      hasInitialized: false,

      // Actions
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const { authAPI } = await import("../api/fakestore");
          const response = await authAPI.login(credentials);

          // Fake Store API returns just a token string
          const token = response.data.token || response.data;

          // Store token in localStorage
          localStorage.setItem("authToken", token);

          // Get user data from JWT token
          let user = null;

          try {
            // Decode JWT token (split by '.' and decode payload)
            const tokenParts = token.split(".");

            if (tokenParts.length === 3) {
              // Add padding if needed for base64 decoding
              let base64Payload = tokenParts[1];

              while (base64Payload.length % 4) {
                base64Payload += "=";
              }

              const payload = JSON.parse(atob(base64Payload));

              user = {
                id: payload.sub, // JWT standard uses 'sub' for user ID
                username: payload.user || credentials.username
              };
            } else {
              throw new Error("Invalid JWT format - not 3 parts");
            }
          } catch (error) {
            console.error("JWT decode error:", error);
            // If token can't be decoded, create a basic user object
            user = {
              id: Date.now(), // Fallback ID
              username: credentials.username
            };
          }

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            hasInitialized: true
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

          // Fake Store API returns just a token string
          const token = response.data;

          // Store token in localStorage
          localStorage.setItem("authToken", token);

          // Get user data from JWT token
          let user = null;
          try {
            // Decode JWT token (split by '.' and decode payload)
            const tokenParts = token.split(".");
            if (tokenParts.length === 3) {
              // Add padding if needed for base64 decoding
              let base64Payload = tokenParts[1];
              while (base64Payload.length % 4) {
                base64Payload += "=";
              }
              const payload = JSON.parse(atob(base64Payload));
              user = {
                id: payload.sub, // JWT standard uses 'sub' for user ID
                username: payload.user || userData.username
              };
            } else {
              throw new Error("Invalid JWT format");
            }
          } catch (error) {
            console.error("JWT decode error:", error);
            // If token can't be decoded, create a basic user object
            user = {
              id: Date.now(), // Fallback ID
              username: userData.username
            };
          }

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            hasInitialized: true
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
        // Remove token from localStorage
        localStorage.removeItem("authToken");

        // Clear persisted auth data
        localStorage.removeItem("auth-storage");

        // Clear all auth state and mark as initialized to prevent auto-login
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
          hasInitialized: true // Mark as initialized to prevent auto-login
        });
      },

      clearError: () => set({ error: null }),

      // Initialize auth state from localStorage (only once)
      initializeAuth: () => {
        const state = get();

        // Only initialize if not already done
        if (state.hasInitialized) {
          return;
        }

        const token = localStorage.getItem("authToken");

        if (token) {
          try {
            // Decode JWT token (split by '.' and decode payload)
            const tokenParts = token.split(".");
            if (tokenParts.length === 3) {
              // Add padding if needed for base64 decoding
              let base64Payload = tokenParts[1];
              while (base64Payload.length % 4) {
                base64Payload += "=";
              }
              const payload = JSON.parse(atob(base64Payload));
              const user = {
                id: payload.sub, // JWT standard uses 'sub' for user ID
                username: payload.user
              };

              set({
                user,
                token,
                isAuthenticated: true,
                hasInitialized: true
              });
            } else {
              throw new Error("Invalid JWT format");
            }
          } catch (error) {
            // Invalid token, clear auth
            localStorage.removeItem("authToken");
            localStorage.removeItem("auth-storage");
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              hasInitialized: true
            });
          }
        } else {
          // No token, mark as initialized
          set({ hasInitialized: true });
        }
      }
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        hasInitialized: state.hasInitialized
      })
    }
  )
);

export default useAuthStore;
