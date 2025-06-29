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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Error Loading Products
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedCategory
                  ? `${selectedCategory} Products`
                  : "All Products"}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {products.length} products available
              </p>
            </div>

            {/* Mobile filter button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg"
            >
              {showFilters ? "Hide" : "Show"} Filters
            </button>
          </div>

          {/* Category filter */}
          <div className={`mt-4 ${showFilters ? "block" : "hidden sm:block"}`}>
            <div className="flex flex-wrap gap-2">
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                  className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  Clear Filter
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading && products.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <Spinner size="xl" />
          </div>
        ) : (
          <InfiniteScroll
            dataLength={products.length}
            next={loadMore}
            hasMore={hasMore && !selectedCategory}
            loader={
              <div className="flex justify-center items-center py-8">
                <Spinner size="lg" />
              </div>
            }
            endMessage={
              <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                <p>No more products to load.</p>
              </div>
            }
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </InfiniteScroll>
        )}

        {!hasMore && products.length > 0 && !selectedCategory && (
          <div className="text-center py-8 text-gray-600 dark:text-gray-400">
            <p>You've reached the end of all products.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
