import { useState, useEffect } from "react";
import { Product } from "../types/products";
import { fetchProducts } from "../api/products"

export function useProducts(venueId: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);

        const response = await fetchProducts(1, 20, null, venueId ?? "");

        setProducts(response.data.results);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  const getProductsByCategory = (category: string) => {
    if (category === "All Items") {
      return products;
    }
    return products.filter((product) => product.categoryId?.name === category);
  };

  const getCategories = () => {
    const categories = ["All Items", ...new Set(products.map((product) => product.categoryId?.name))];
    return categories;
  };

  return {
    products,
    loading,
    error,
    getProductsByCategory,
    getCategories,
  };
}
