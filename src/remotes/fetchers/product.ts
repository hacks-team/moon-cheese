import type { Product } from '@/types';
import { http } from '@/utils/http';

type RecentProduct = {
  id: number;
  thumbnail: string;
  name: string;
  price: number;
};

type GetRecentProductResponse = {
  recentProducts: RecentProduct[];
};

type GetProductListResponse = {
  products: Product[];
};

type GetProductDetailResponse = Product;

type GetRecommendProductIdsResponse = {
  recommendProductIds: number[];
};

export const getRecentProductList = () => http.get<GetRecentProductResponse>('/api/recent/product/list');

export const getProductList = () => http.get<GetProductListResponse>('/api/product/list');

export const getProductDetail = (id: number) => http.get<GetProductDetailResponse>(`/api/product/${id}`);

export const getRecommendProductIds = (id: number) =>
  http.get<GetRecommendProductIdsResponse>(`/api/product/recommend/${id}`);
