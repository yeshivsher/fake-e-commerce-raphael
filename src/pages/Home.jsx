import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import ProductCard from "../components/products/ProductCard";
import Spinner from "../components/ui/Spinner";
import useProducts from "../hooks/useProducts";

const Home = () => {
  const {
    products,
    categories,
    selectedCategory,
    isLoading,
    error,
    hasMore,
    loadMore,
    changeCategory,
    resetToAllProducts
  } = useProducts();

  const [showFilters, setShowFilters] = useState(false);

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    if (category === "") {
      resetToAllProducts();
    } else {
      changeCategory(category);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-6xl mb-6 animate-bounce-gentle">⚠️</div>
            <h2 className="text-3xl font-bold gradient-text mb-4">
              Error Loading Products
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-500 via-primary-600 to-secondary-600">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-secondary-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 text-shadow-lg animate-fade-in">
              {selectedCategory
                ? `${selectedCategory} Collection`
                : "Discover Amazing Products"}
            </h1>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto animate-slide-up">
              {selectedCategory
                ? `Explore our curated selection of ${selectedCategory.toLowerCase()} products`
                : "Shop the latest trends and find your perfect match from our extensive collection"}
            </p>
            <div className="flex flex-wrap justify-center gap-4 animate-slide-up">
              <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                {products.length} products available
              </span>
              <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                Free shipping
              </span>
              <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                Secure checkout
              </span>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
        <div
          className="absolute bottom-10 right-10 w-16 h-16 bg-white/10 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-20 w-12 h-12 bg-white/10 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Filter Section */}
      <div className="glass-effect sticky top-0 z-10 border-b border-white/20 dark:border-gray-700/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Mobile filter button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden btn-secondary text-sm"
            >
              {showFilters ? "Hide" : "Show"} Filters
            </button>

            {/* Category filter */}
            <div
              className={`flex-1 ${showFilters ? "block" : "hidden sm:block"}`}
            >
              <div className="flex flex-wrap items-center gap-4">
                <select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  className="input-field max-w-xs"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>

                {selectedCategory && (
                  <button
                    onClick={resetToAllProducts}
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium text-sm transition-colors duration-200"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="hidden sm:flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-gentle"></div>
                <span>Live inventory</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-pulse-gentle"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <span>Real-time updates</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading && products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
              <div
                className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-secondary-600 rounded-full animate-spin"
                style={{
                  animationDirection: "reverse",
                  animationDuration: "1.5s"
                }}
              ></div>
            </div>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 animate-fade-in">
              Loading amazing products...
            </p>
          </div>
        ) : (
          <InfiniteScroll
            dataLength={products.length}
            next={loadMore}
            hasMore={hasMore && !selectedCategory}
            loader={
              <div className="flex justify-center items-center py-12">
                <div className="flex items-center gap-3">
                  <Spinner size="lg" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Loading more products...
                  </span>
                </div>
              </div>
            }
            endMessage={
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🎉</div>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                  You've reached the end!
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  No more products to load.
                </p>
              </div>
            }
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {products.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </InfiniteScroll>
        )}

        {!hasMore && products.length > 0 && !selectedCategory && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🎉</div>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
              You've reached the end!
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              You've seen all our amazing products.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
