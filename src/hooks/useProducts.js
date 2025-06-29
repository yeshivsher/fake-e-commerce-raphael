import { useState, useEffect, useCallback } from "react";
import { productsAPI } from "../api/fakestore";

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      setError(null);
      const response = await productsAPI.getCategories();
      setCategories(response.data);
    } catch (err) {
      setError("Failed to fetch categories");
      console.error("Error fetching categories:", err);
    }
  }, []);

  // Fetch products
  const fetchProducts = useCallback(
    async (category = "", reset = false) => {
      try {
        setIsLoading(true);
        setError(null);

        const currentPage = reset ? 1 : page;
        const limit = 20;

        let response;
        if (category) {
          response = await productsAPI.getByCategory(category);
          const newProducts = response.data;
          setProducts(newProducts);
          setPage(1);
          setHasMore(false); // No infinite scroll for category filters
        } else {
          // For all products, we need to handle pagination properly
          // The Fake Store API doesn't support real pagination, so we'll simulate it
          response = await productsAPI.getAll(); // Get all products
          const allProducts = response.data;

          if (reset) {
            // First load: show first 20 products
            setProducts(allProducts.slice(0, limit));
            setPage(1);
            setTotalProducts(allProducts.length);
            setHasMore(allProducts.length > limit);
          } else {
            // Load more: add next batch
            const startIndex = (currentPage - 1) * limit;
            const endIndex = startIndex + limit;
            const newProducts = allProducts.slice(startIndex, endIndex);

            if (newProducts.length > 0) {
              setProducts((prev) => [...prev, ...newProducts]);
              setPage(currentPage + 1);
              setHasMore(endIndex < allProducts.length);
            } else {
              setHasMore(false);
            }
          }
        }
      } catch (err) {
        setError("Failed to fetch products");
        console.error("Error fetching products:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [page]
  );

  // Load more products (for infinite scroll)
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore && !selectedCategory) {
      fetchProducts("", false);
    }
  }, [isLoading, hasMore, selectedCategory, fetchProducts]);

  // Change category
  const changeCategory = useCallback(
    (category) => {
      setSelectedCategory(category);
      fetchProducts(category, true);
    },
    [fetchProducts]
  );

  // Reset to all products
  const resetToAllProducts = useCallback(() => {
    setSelectedCategory("");
    fetchProducts("", true);
  }, [fetchProducts]);

  // Initial load
  useEffect(() => {
    fetchCategories();
    fetchProducts("", true);
  }, [fetchCategories, fetchProducts]);

  return {
    products,
    categories,
    selectedCategory,
    isLoading,
    error,
    hasMore,
    loadMore,
    changeCategory,
    resetToAllProducts,
    refetch: () => fetchProducts(selectedCategory, true)
  };
};

export default useProducts;
