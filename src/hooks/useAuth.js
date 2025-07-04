import { useEffect, useRef } from "react";
import useAuthStore from "../store/authStore";
import useCartStore from "../store/cartStore";
import { logError } from "../utils/errorUtils";

const useAuth = () => {
  const authStore = useAuthStore();
  const cartStore = useCartStore();
  const previousUserIdRef = useRef(null);

  // Initialize auth state only once when the app starts
  useEffect(() => {
    // Only initialize if not already done
    if (!authStore.hasInitialized) {
      authStore.initializeAuth();
    }
  }, [authStore]);

  // Force reload cart data when component mounts if user is already authenticated
  useEffect(() => {
    if (
      authStore.hasInitialized &&
      authStore.isAuthenticated &&
      authStore.user
    ) {
      const timer = setTimeout(() => {
        try {
          cartStore.rehydrateCartForUser();
        } catch (error) {
          logError("rehydrating cart on mount", error);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [
    authStore.hasInitialized,
    authStore.isAuthenticated,
    authStore.user,
    cartStore
  ]);

  // Rehydrate cart when user authentication state changes
  useEffect(() => {
    if (authStore.hasInitialized) {
      const currentUserId =
        authStore.user?.id || authStore.user?.username || null;
      const previousUserId = previousUserIdRef.current;

      // Check if user has changed (different user logged in) or if authentication state changed
      if (currentUserId !== previousUserId) {
        if (authStore.isAuthenticated && authStore.user) {
          // User is authenticated, load their cart data
          const timer = setTimeout(() => {
            try {
              cartStore.rehydrateCartForUser();
            } catch (error) {
              logError("rehydrating cart", error);
            }
          }, 300);

          return () => clearTimeout(timer);
        } else {
          // User is not authenticated, clear cart
          cartStore.clearCurrentUserCart();
        }

        // Update the ref to track current user ID
        previousUserIdRef.current = currentUserId;
      }
    }
  }, [
    authStore.isAuthenticated,
    authStore.user,
    authStore.hasInitialized,
    cartStore
  ]);

  return authStore;
};

export default useAuth;
