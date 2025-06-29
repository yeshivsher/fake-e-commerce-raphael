import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import useCartStore from "../store/cartStore";
import useAuth from "../hooks/useAuth";

const Cart = () => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getCartCount,
    clearCart
  } = useCartStore();
  const { isAuthenticated } = useAuth();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(price);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    updateQuantity(productId, parseInt(newQuantity) || 0);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="text-6xl mb-6">🔒</div>
          <h1 className="text-3xl font-bold mb-4">Sign in Required</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            You need to be signed in to view your cart.
          </p>
          <Link to="/login" className="btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-8xl mb-6 animate-bounce-gentle">🛒</div>
            <h1 className="text-4xl font-bold gradient-text mb-4">
              Your cart is empty
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Link to="/" className="btn-primary">
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card overflow-hidden">
          {/* Header */}
          <div className="px-6 py-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center shadow-soft">
                  <span className="text-white font-bold">🛒</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold gradient-text">
                    Shopping Cart
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    {getCartCount()} items in your cart
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={clearCart}
                className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900/20"
              >
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Cart Items */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="p-6 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center space-x-6">
                  {/* Product Image */}
                  <div className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl overflow-hidden shadow-soft">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-contain p-3"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate mb-2">
                      {item.category}
                    </p>
                    <div className="flex items-center">
                      <span className="text-xl font-bold gradient-text">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-3">
                    <label
                      htmlFor={`quantity-${item.id}`}
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Qty:
                    </label>
                    <select
                      id={`quantity-${item.id}`}
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.id, e.target.value)
                      }
                      className="input-field max-w-20"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {item.quantity} × {formatPrice(item.price)}
                    </div>
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900/20"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="px-6 py-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  Total ({getCartCount()} items)
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Shipping and taxes calculated at checkout
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold gradient-text">
                  {formatPrice(getCartTotal())}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/" className="btn-secondary flex-1 text-center">
                Continue Shopping
              </Link>
              <Button
                variant="primary"
                size="lg"
                className="flex-1"
                disabled={items.length === 0}
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
