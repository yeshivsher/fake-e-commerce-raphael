import { useEffect, useRef } from "react";
import useAuthStore from "../store/authStore";
import useCartStore from "../store/cartStore";

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
  }, []); // Empty dependency array to run only once

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
          console.error("Error rehydrating cart on mount:", error);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [authStore.hasInitialized]); // Only run when auth is initialized

  // Rehydrate cart when user authentication state changes
  useEffect(() => {
    if (authStore.hasInitialized) {
      const currentUserId =
        authStore.user?.id || authStore.user?.username || null;
      const previousUserId = previousUserIdRef.current;

      // Check if user has changed (different user logged in) or if authentication state changed
      if (currentUserId !== previousUserId) {
        console.log('👤 User changed:', previousUserId, '→', currentUserId);
        
        if (authStore.isAuthenticated && authStore.user) {
          // User is authenticated, load their cart data
          console.log('🔑 Loading cart for authenticated user:', currentUserId);
          const timer = setTimeout(() => {
            try {
              cartStore.rehydrateCartForUser();
            } catch (error) {
              console.error("Error rehydrating cart:", error);
            }
          }, 300);

          return () => clearTimeout(timer);
        } else {
          // User is not authenticated, clear cart
          console.log('🚪 User logged out, clearing cart');
          cartStore.clearCurrentUserCart();
        }

        // Update the ref to track current user ID
        previousUserIdRef.current = currentUserId;
      }
    }
  }, [authStore.isAuthenticated, authStore.user, authStore.hasInitialized]); // Removed cartStore from dependencies

  return authStore;
};

export default useAuth;
