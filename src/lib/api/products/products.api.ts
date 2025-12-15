import { http } from '@/utils/http';
import type { RecentProductListResponse, ProductListResponse, RecommendedProductListResponse } from './products.type';
import type { Product } from '@/lib/types/products';

export const getRecentProductList = async (): Promise<RecentProductListResponse['recentProducts']> => {
  const response = await http.get<RecentProductListResponse>('/api/recent/product/list');

  return response.recentProducts;
};

export const getProductList = async (): Promise<ProductListResponse['products']> => {
  const response = await http.get<ProductListResponse>('/api/product/list');

  return response.products;
};

export const getProductDetail = async (id: number): Promise<Product> => {
  const response = await http.get<Product>(`/api/product/${id}`);

  return response;
};

export const getRecommendedProductList = async (
  id: number
): Promise<RecommendedProductListResponse['recommendProductIds']> => {
  const response = await http.get<RecommendedProductListResponse>(`/api/product/recommend/${id}`);

  return response.recommendProductIds;
};
