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

type RecommendProductResponse = {
  recommendProductIds: number[];
};

export type PurchaseRequest = {
  deliveryType: 'EXPRESS' | 'PREMIUM';
  totalPrice: number;
  items: Array<{
    productId: number;
    quantity: number;
  }>;
};

/** 상품 구매 API */
export function purchaseProduct(request: PurchaseRequest) {
  return http.post<PurchaseRequest, null>('/api/product/purchase', request);
}

export const productQueries = createQueryKeys('product', {
  list: {
    queryKey: null,
    queryFn: () => http.get<ProductListResponse>('/api/product/list'),
  },
  recent: {
    queryKey: null,
    queryFn: () => http.get<RecentProductResponse>('/api/recent/product/list'),
  },
  detail: (id: number) => ({
    queryKey: [id],
    queryFn: () => http.get<Product>(`/api/product/${id}`),
  }),
  recommend: (id: number) => ({
    queryKey: [id],
    queryFn: () => http.get<RecommendProductResponse>(`/api/product/recommend/${id}`),
  }),
});
