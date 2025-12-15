import type { RecentProduct, Product } from '@/lib/types/products';

export type RecentProductListResponse = {
  recentProducts: RecentProduct[];
};

export type ProductListResponse = {
  products: Product[];
};

export type RecommendedProductListResponse = {
  recommendProductIds: number[];
};
