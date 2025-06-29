// Centralized user ID extraction utility
export const getUserIdentifier = () => {
  try {
    // First try to get from auth-storage (Zustand persist structure)
    const authStore = JSON.parse(localStorage.getItem("auth-storage") || "{}");

    // Check if auth store is properly initialized
    if (!authStore.hasInitialized && !authStore.state?.hasInitialized) {
      return "anonymous";
    }

    // Zustand persist stores data in different structures - try both
    const user = authStore.user || authStore.state?.user;

    if (user && user.id) {
      // Use user ID as primary identifier
      return user.id.toString();
    } else if (user && user.username) {
      // Fallback to username
      return user.username;
    } else if (user && user.email) {
      // Fallback to email
      return user.email.replace(/[^a-zA-Z0-9]/g, "_");
    }

    // Fallback: try to get from authToken
    const token = localStorage.getItem("authToken");

    if (token) {
      try {
        // Decode JWT token properly
        const tokenParts = token.split(".");
        if (tokenParts.length === 3) {
          let base64Payload = tokenParts[1];
          while (base64Payload.length % 4) {
            base64Payload += "=";
          }
          const payload = JSON.parse(atob(base64Payload));

          if (payload.sub) {
            return payload.sub.toString();
          } else if (payload.user) {
            return payload.user;
          }
        }
      } catch (error) {
        console.error("Error parsing auth token:", error);
      }
    }

    return "anonymous";
  } catch (error) {
    console.error("Error getting user identifier:", error);
    return "anonymous";
  }
};

// Helper function to get cart key for current user
export const getCartKey = () => {
  const userId = getUserIdentifier();
  return `cart-storage-${userId}`;
};
