import type { Product } from '@/type';
import { http } from '@/utils/http';

interface getRecentProductListResponse {
  recentProducts: Product[];
}
export const getRecentProductList = async () => {
  const response = await http.get<getRecentProductListResponse>('/api/recent/product/list');
  return response;
};
