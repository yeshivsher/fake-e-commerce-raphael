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

          // Get user data from JWT token to extract user ID
          let userId = null;
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
              userId = payload.sub; // JWT standard uses 'sub' for user ID
            } else {
              throw new Error("Invalid JWT format - not 3 parts");
            }
          } catch (error) {
            console.error("JWT decode error:", error);
            throw new Error("Invalid authentication token");
          }

          // Fetch full user data from API
          const userResponse = await authAPI.getUser(userId);
          const user = userResponse.data;

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
          console.log("Registration - userData received:", userData);
          const response = await authAPI.register(userData);
          console.log("Registration - API response:", response.data);

          // Fake Store API /users endpoint returns only {"id": userId}
          const userResponse = response.data;

          // For registration, we don't get a token, so we'll use the user ID as a simple identifier
          // In a real app, you'd typically get a token after registration
          const token = `user_${userResponse.id}`;

          // Store token in localStorage
          localStorage.setItem("authToken", token);

          // Create user object from the original form data and the returned ID
          const user = {
            id: userResponse.id,
            username: userData.username,
            firstname: userData.name?.firstname || "",
            lastname: userData.name?.lastname || "",
            email: userData.email
          };

          console.log("Registration - created user object:", user);

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
          console.error("Registration error:", error);
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
      initializeAuth: async () => {
        const state = get();

        // Only initialize if not already done
        if (state.hasInitialized) {
          return;
        }

        const token = localStorage.getItem("authToken");

        if (token) {
          try {
            // Check if it's a user token (from registration) or JWT token (from login)
            if (token.startsWith("user_")) {
              // User token from registration
              const userId = token.replace("user_", "");

              // Fetch full user data from API
              const { authAPI } = await import("../api/fakestore");
              const userResponse = await authAPI.getUser(userId);
              const user = userResponse.data;

              set({
                user,
                token,
                isAuthenticated: true,
                hasInitialized: true
              });
            } else {
              // JWT token from login
              const tokenParts = token.split(".");
              if (tokenParts.length === 3) {
                // Add padding if needed for base64 decoding
                let base64Payload = tokenParts[1];
                while (base64Payload.length % 4) {
                  base64Payload += "=";
                }
                const payload = JSON.parse(atob(base64Payload));
                const userId = payload.sub; // JWT standard uses 'sub' for user ID

                // Fetch full user data from API
                const { authAPI } = await import("../api/fakestore");
                const userResponse = await authAPI.getUser(userId);
                const user = userResponse.data;

                set({
                  user,
                  token,
                  isAuthenticated: true,
                  hasInitialized: true
                });
              } else {
                throw new Error("Invalid JWT format");
              }
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
