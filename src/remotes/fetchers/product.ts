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

export const getRecentProductList = () => http.get<GetRecentProductResponse>('/api/recent/product/list');

export const getProductList = () => http.get<GetProductListResponse>('/api/product/list');
