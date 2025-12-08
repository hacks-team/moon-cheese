import type { Product } from '@/types/product';
import { http } from '@/utils/http';
import { createQueryKeys } from '@lukemorales/query-key-factory';

type ProductListResponse = {
  products: Product[];
};

export type RecentProduct = {
  id: number;
  thumbnail: string;
  name: string;
  price: number;
};

type RecentProductResponse = {
  recentProducts: RecentProduct[];
};

export const productQueries = createQueryKeys('product', {
  list: {
    queryKey: null,
    queryFn: () => http.get<ProductListResponse>('/api/product/list'),
  },
  recent: {
    queryKey: null,
    queryFn: () => http.get<RecentProductResponse>('/api/recent/product/list'),
  },
});
