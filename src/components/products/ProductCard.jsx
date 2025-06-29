import PropTypes from "prop-types";
import { useState } from "react";
import Button from "../ui/Button";
import useCartStore from "../../store/cartStore";

const ProductCard = ({ product }) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
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
        <span className="text-yellow-400">{stars}</span>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          ({rating.count})
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <div className="relative h-48 bg-gray-200 dark:bg-gray-700 flex-shrink-0">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-contain p-4"
          loading="lazy"
        />
        {currentQuantity > 0 && (
          <div className="absolute top-2 right-2 bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
            {currentQuantity} in cart
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col h-full">
        <div className="mb-2">
          <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded-full">
            {product.category}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {product.title}
        </h3>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
          {product.description}
        </p>

        {/* Bottom section sticks to the end */}
        <div className="mt-auto flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary-600">
              {formatPrice(product.price)}
            </span>
            {formatRating(product.rating)}
          </div>
          <Button
            onClick={handleAddToCart}
            loading={isAddingToCart}
            disabled={isAddingToCart}
            className="w-full"
            variant={currentQuantity > 0 ? "secondary" : "primary"}
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
