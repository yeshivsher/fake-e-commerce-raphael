import { create } from "zustand";
import { persist } from "zustand/middleware";

// Helper function to get current user ID for cart scoping
const getCurrentUserId = () => {
  try {
    const authStore = JSON.parse(localStorage.getItem("auth-storage") || "{}");
    const user = authStore.state?.user;
    return user?.id || user?.username || "anonymous";
  } catch (error) {
    console.error("Error getting user ID for cart scoping:", error);
    return "anonymous";
  }
};

// Custom storage for user-specific cart data
const createUserSpecificStorage = () => {
  return {
    getItem: (name) => {
      const userId = getCurrentUserId();
      const key = `${name}-${userId}`;
      try {
        const data = localStorage.getItem(key);
        return data;
      } catch (error) {
        console.error("Error getting cart data:", error);
        return null;
      }
    },
    setItem: (name, value) => {
      const userId = getCurrentUserId();
      const key = `${name}-${userId}`;
      try {
        localStorage.setItem(key, value);
      } catch (error) {
        console.error("Error setting cart data:", error);
      }
    },
    removeItem: (name) => {
      const userId = getCurrentUserId();
      const key = `${name}-${userId}`;
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error("Error removing cart data:", error);
      }
    }
  };
};

const useCartStore = create(
  persist(
    (set, get) => ({
      // State
      items: [],
      isLoading: false,

      // Actions
      addToCart: (product, quantity = 1) => {
        console.log("addToCart called with:", product.title, quantity);
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.id === product.id
          );

          if (existingItem) {
            // Update quantity if item already exists
            const updatedItems = state.items.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
            console.log("Updated existing item, new items:", updatedItems);
            return { items: updatedItems };
          } else {
            // Add new item
            const newItems = [...state.items, { ...product, quantity }];
            console.log("Added new item, new items:", newItems);
            return {
              items: newItems
            };
          }
        });
      },

      removeFromCart: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId)
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          )
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      // Clear cart and storage completely (for logout)
      clearCartAndStorage: () => {
        try {
          const userId = getCurrentUserId();
          const cartKey = `cart-storage-${userId}`;
          localStorage.removeItem(cartKey);
          localStorage.removeItem("cart-storage");
        } catch (error) {
          console.error("Error clearing cart storage:", error);
        }
        set({ items: [] });
      },

      // Reset cart state (for user changes)
      resetCart: () => {
        set({ items: [] });
      },

      // Computed values
      getCartTotal: () => {
        const { items } = get();
        return items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
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
    }),
    {
      name: "cart-storage",
      storage: createUserSpecificStorage(),
      partialize: (state) => ({
        items: state.items
      })
    }
  )
);

// Listen for logout events and reset cart
if (typeof window !== "undefined") {
  window.addEventListener("userLoggedOut", () => {
    useCartStore.getState().resetCart();
  });
}

export default useCartStore;
