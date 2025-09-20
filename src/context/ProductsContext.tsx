import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { products as defaultProducts, Product } from '@/data/products';
import { apiClient } from '@/lib/api';

type ProductsContextValue = {
  products: Product[];
  setProducts: (next: Product[]) => Promise<void>;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  resetProducts: () => void;
  isLoading: boolean;
  error: string | null;
  loadProducts: () => Promise<void>;
};

const PRODUCTS_STORAGE_KEY = 'ks_products_override_v1';

const readStoredProducts = (): Product[] => {
  if (typeof window === 'undefined') {
    return defaultProducts;
  }

  try {
    const raw = window.localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (!raw) {
      return defaultProducts;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return defaultProducts;
    }
    return parsed as Product[];
  } catch (error) {
    console.error('Failed to parse stored products:', error);
    return defaultProducts;
  }
};

const ProductsContext = createContext<ProductsContextValue | undefined>(undefined);

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProductsState] = useState<Product[]>(() => readStoredProducts());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load products from server on mount
  useEffect(() => {
    loadProducts();
  }, []);

  // Persist to localStorage as backup (fallback)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch (error) {
      console.error('Failed to persist products to localStorage:', error);
    }
  }, [products]);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const serverProducts = await apiClient.getProducts();
      if (serverProducts && serverProducts.length > 0) {
        setProductsState(serverProducts);
      } else {
        // If no products from server, use default products
        setProductsState(defaultProducts);
      }
    } catch (error) {
      console.error('Failed to load products from server:', error);
      setError('Failed to load products from server. Using default products.');
      // Use default products as fallback
      setProductsState(defaultProducts);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setProducts = useCallback(async (next: Product[]) => {
    setIsLoading(true);
    setError(null);

    try {
      // Sync to server
      await apiClient.updateProducts(next);
      setProductsState(next);
    } catch (error) {
      console.error('Failed to save products to server:', error);
      setError('Failed to save products to server. Changes saved locally only.');
      // Still update local state even if server update fails
      setProductsState(next);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProduct = useCallback((product: Product) => {
    setProductsState((prev) => {
      const exists = prev.findIndex((item) => item.id === product.id);
      if (exists === -1) {
        return [...prev, product];
      }
      const next = [...prev];
      next[exists] = product;
      return next;
    });
  }, []);

  const deleteProduct = useCallback((productId: string) => {
    setProductsState((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const resetProducts = useCallback(() => {
    setProductsState(defaultProducts);
  }, []);

  const value = useMemo<ProductsContextValue>(
    () => ({
      products,
      setProducts,
      updateProduct,
      deleteProduct,
      resetProducts,
      isLoading,
      error,
      loadProducts
    }),
    [products, setProducts, updateProduct, deleteProduct, resetProducts, isLoading, error, loadProducts],
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
};

export const useProductsContext = (): ProductsContextValue => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProductsContext must be used within a ProductsProvider');
  }
  return context;
};
