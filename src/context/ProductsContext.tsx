import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { products as defaultProducts, Product } from '@/data/products';

type ProductsContextValue = {
  products: Product[];
  setProducts: (next: Product[]) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  resetProducts: () => void;
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

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch (error) {
      console.error('Failed to persist products:', error);
    }
  }, [products]);

  const setProducts = useCallback((next: Product[]) => {
    setProductsState(next);
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
    () => ({ products, setProducts, updateProduct, deleteProduct, resetProducts }),
    [products, setProducts, updateProduct, deleteProduct, resetProducts],
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
