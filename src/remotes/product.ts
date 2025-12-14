import type { Product, RecentProduct } from '@/type';
import { http } from '@/utils/http';

interface getRecentProductListResponse {
  recentProducts: RecentProduct[];
}
export const getRecentProductList = async () => {
  const response = await http.get<getRecentProductListResponse>('/api/recent/product/list');
  return response;
};

interface getProductListResponse {
  products: Product[];
}

export const getProductList = async () => {
  const response = await http.get<getProductListResponse>('/api/product/list');
  return response;
};

type getProductByIdResponse = Product;

export const getProductById = async (productId: number) => {
  const response = await http.get<getProductByIdResponse>(`/api/product/${productId}`);
  return response;
};

interface getRecommendProductIdsByProductIdResponse {
  recommendProductIds: number[];
}

export const getRecommendProductIdsByProductId = async (productId: number) => {
  const response = await http.get<getRecommendProductIdsByProductIdResponse>(`/api/product/recommend/${productId}`);
  return response;
};
