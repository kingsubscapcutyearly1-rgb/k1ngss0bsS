import { useQuery } from '@tanstack/react-query';
import { products } from '@/data/products';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      // Simulate API call - in real app this would fetch from your backend
      return new Promise((resolve) => {
        setTimeout(() => resolve(products), 100);
      });
    },
  });
};