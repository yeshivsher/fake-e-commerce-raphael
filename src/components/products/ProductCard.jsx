import PropTypes from "prop-types";
import { useState } from "react";
import Button from "../ui/Button";
import useCartStore from "../../store/cartStore";

const ProductCard = ({ product }) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);
  const getItemQuantity = useCartStore((state) => state.getItemQuantity);

  const currentQuantity = getItemQuantity(product.id);

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      console.log("Adding to cart:", product.title);
      addToCart(product, 1);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("Added to cart successfully");
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(price);
  };

  const formatRating = (rating) => {
    const stars =
      "★".repeat(Math.floor(rating.rate)) +
      "☆".repeat(5 - Math.floor(rating.rate));
    return (
      <div className="flex items-center gap-1">
        <span className="text-yellow-400 text-sm">{stars}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          ({rating.count})
        </span>
      </div>
    );
  };

  return (
    <div className="card card-hover group animate-fade-in overflow-hidden">
      {/* Image Container */}
      <div className="relative h-56 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <img
          src={product.image}
          alt={product.title}
          className={`w-full h-full object-contain p-6 transition-all duration-500 ${
            imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
          } group-hover:scale-110`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
        />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-block bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-soft">
            {product.category}
          </span>
        </div>

        {/* Cart Badge */}
        {currentQuantity > 0 && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-accent-500 to-accent-600 text-white text-xs px-3 py-1 rounded-full font-medium shadow-soft animate-bounce-gentle">
            {currentQuantity} in cart
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col h-full">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors duration-300">
            {product.title}
          </h3>

          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
            {product.description}
          </p>
        </div>

        {/* Bottom Section */}
        <div className="mt-auto space-y-4">
          {/* Price and Rating */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-2xl font-bold gradient-text">
                {formatPrice(product.price)}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Free shipping
              </span>
            </div>
            {formatRating(product.rating)}
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            loading={isAddingToCart}
            disabled={isAddingToCart}
            className="w-full"
            variant={currentQuantity > 0 ? "secondary" : "primary"}
            size="md"
          >
            {isAddingToCart
              ? "Adding..."
              : currentQuantity > 0
              ? `Add Another (${currentQuantity})`
              : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    rating: PropTypes.shape({
      rate: PropTypes.number.isRequired,
      count: PropTypes.number.isRequired
    }).isRequired
  }).isRequired
};

export default ProductCard;
