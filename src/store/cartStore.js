import { create } from "zustand";
import { getUserIdentifier, getCartKey } from "../utils/userUtils";

// Helper function to check if cart data is expired
const isCartExpired = (cartData) => {
  try {
    const parsedData = JSON.parse(cartData);
    const timestamp = parsedData.timestamp || 0;
    const now = Date.now();
    const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

    return now - timestamp > maxAge;
  } catch (error) {
    return true; // If we can't parse, consider it expired
  }
};

// Helper function to load cart data from localStorage for current user
const loadCartDataForCurrentUser = () => {
  try {
    const cartKey = getCartKey();
    const cartData = localStorage.getItem(cartKey);

    if (cartData) {
      // Check if cart data is expired
      if (isCartExpired(cartData)) {
        localStorage.removeItem(cartKey);
        return [];
      }

      const parsedData = JSON.parse(cartData);
      if (parsedData.state?.items) {
        return parsedData.state.items;
      }
    }

    // If no cart data found, try to migrate from old format
    const migratedData = migrateOldCartData();
    if (migratedData.length > 0) {
      return migratedData;
    }

    return [];
  } catch (error) {
    console.error("Error loading cart data:", error);
    return [];
  }
};

// Helper function to migrate old cart data formats
const migrateOldCartData = () => {
  try {
    // Only migrate from truly old format keys (without user ID)
    // Don't migrate from other user's cart keys!
    const oldKeys = Object.keys(localStorage).filter(
      (key) => key === "cart-storage" && key !== getCartKey()
    );

    for (const oldKey of oldKeys) {
      const oldData = localStorage.getItem(oldKey);
      if (oldData) {
        try {
          const parsedData = JSON.parse(oldData);
          if (parsedData.state?.items && parsedData.state.items.length > 0) {
            // Save to new location
            saveCartDataForCurrentUser(parsedData.state.items);
            // Remove old data
            localStorage.removeItem(oldKey);
            return parsedData.state.items;
          }
        } catch (error) {
          console.error("Error parsing old cart data:", error);
        }
      }
    }

    return [];
  } catch (error) {
    console.error("Error migrating old cart data:", error);
    return [];
  }
};

// Helper function to clean up old cart data
const cleanupOldCartData = () => {
  try {
    const cartKeys = Object.keys(localStorage).filter((key) =>
      key.startsWith("cart-storage")
    );

    // Keep only the most recent 100 cart entries to prevent localStorage bloat
    // Increased from 50 to 100 to be more conservative
    if (cartKeys.length > 100) {
      const cartDataWithTimestamps = cartKeys.map((key) => {
        try {
          const data = localStorage.getItem(key);
          const parsed = JSON.parse(data);
          return {
            key,
            timestamp: parsed.timestamp || 0,
            size: data.length
          };
        } catch (error) {
          return { key, timestamp: 0, size: 0 };
        }
      });

      // Sort by timestamp (oldest first) and remove oldest entries
      cartDataWithTimestamps.sort((a, b) => a.timestamp - b.timestamp);
      const keysToRemove = cartDataWithTimestamps.slice(
        0,
        cartKeys.length - 100
      );

      keysToRemove.forEach(({ key }) => {
        localStorage.removeItem(key);
      });
    }
  } catch (error) {
    console.error("Error cleaning up old cart data:", error);
  }
};

// Helper function to save cart data to localStorage for current user
const saveCartDataForCurrentUser = (items) => {
  try {
    const cartKey = getCartKey();
    const cartData = {
      state: {
        items: items
      },
      timestamp: Date.now(), // Add timestamp for cleanup
      userId: getUserIdentifier()
    };
    localStorage.setItem(cartKey, JSON.stringify(cartData));

    // Clean up old cart data less frequently (1% chance instead of 10%)
    if (Math.random() < 0.01) {
      cleanupOldCartData();
    }
  } catch (error) {
    console.error("Error saving cart data:", error);
  }
};

const useCartStore = create((set, get) => ({
  // State
  items: [], // Start with empty cart, will be loaded when user is authenticated
  isLoading: false,
  currentUserId: null, // Track current user to detect user changes

  // Actions
  addToCart: (product, quantity = 1) => {
    set((state) => {
      const existingItem = state.items.find((item) => item.id === product.id);

      let newItems;
      if (existingItem) {
        // Update quantity if item already exists
        newItems = state.items.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        newItems = [...state.items, { ...product, quantity }];
      }

      // Save to localStorage for current user
      saveCartDataForCurrentUser(newItems);

      return { items: newItems };
    });
  },

  removeFromCart: (productId) => {
    set((state) => {
      const newItems = state.items.filter((item) => item.id !== productId);
      saveCartDataForCurrentUser(newItems);
      return { items: newItems };
    });
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }

    set((state) => {
      const newItems = state.items.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
      saveCartDataForCurrentUser(newItems);
      return { items: newItems };
    });
  },

  clearCart: () => {
    set({ items: [] });
    saveCartDataForCurrentUser([]);
  },

  // Clear cart and storage completely (for logout)
  clearCartAndStorage: () => {
    try {
      const userId = getUserIdentifier();
      const cartKey = `cart-storage-${userId}`;
      localStorage.removeItem(cartKey);
      localStorage.removeItem("cart-storage");
    } catch (error) {
      console.error("Error clearing cart storage:", error);
    }
    set({ items: [], currentUserId: null });
  },

  // Reset cart state (for user changes)
  resetCart: () => {
    set({ items: [], currentUserId: null });
  },

  // Clear current user's cart data from localStorage (for logout)
  clearCurrentUserCart: () => {
    try {
      const userId = getUserIdentifier();
      const cartKey = `cart-storage-${userId}`;
      localStorage.removeItem(cartKey);
      set({ items: [], currentUserId: null });
    } catch (error) {
      console.error("Error clearing current user cart:", error);
    }
  },

  // Rehydrate cart for current user (called after auth is initialized)
  rehydrateCartForUser: () => {
    try {
      const userId = getUserIdentifier();
      const currentUserId = get().currentUserId;

      // Always rehydrate if user has changed or if we haven't loaded yet
      if (userId !== currentUserId || currentUserId === null) {
        const cartData = loadCartDataForCurrentUser();
        set({
          items: cartData,
          currentUserId: userId
        });
      }
    } catch (error) {
      console.error("Error rehydrating cart for user:", error);
    }
  },

  // Force reload cart data
  reloadCartData: () => {
    try {
      const cartData = loadCartDataForCurrentUser();
      const userId = getUserIdentifier();
      set({
        items: cartData,
        currentUserId: userId
      });
    } catch (error) {
      console.error("Error reloading cart data:", error);
    }
  },

  // Get cart storage statistics (useful for monitoring)
  getCartStorageStats: () => {
    try {
      const cartKeys = Object.keys(localStorage).filter((key) =>
        key.startsWith("cart-storage")
      );

      const stats = {
        totalCarts: cartKeys.length,
        totalSize: 0,
        expiredCarts: 0,
        activeCarts: 0,
        oldestCart: null,
        newestCart: null
      };

      cartKeys.forEach((key) => {
        try {
          const data = localStorage.getItem(key);
          stats.totalSize += data.length;

          if (isCartExpired(data)) {
            stats.expiredCarts++;
          } else {
            stats.activeCarts++;
          }

          const parsed = JSON.parse(data);
          const timestamp = parsed.timestamp || 0;

          if (!stats.oldestCart || timestamp < stats.oldestCart.timestamp) {
            stats.oldestCart = { key, timestamp, userId: parsed.userId };
          }

          if (!stats.newestCart || timestamp > stats.newestCart.timestamp) {
            stats.newestCart = { key, timestamp, userId: parsed.userId };
          }
        } catch (error) {
          console.error("Error processing cart key:", key, error);
        }
      });

      return stats;
    } catch (error) {
      console.error("Error getting cart storage stats:", error);
      return null;
    }
  },

  // Computed values
  getCartTotal: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  },

  getCartCount: () => {
    const { items } = get();
    return items.reduce((count, item) => count + item.quantity, 0);
  },

  getItemQuantity: (productId) => {
    const { items } = get();
    const item = items.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  }
}));

export default useCartStore;
