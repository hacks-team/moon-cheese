import { http } from '@/utils/http';
import { createQueryKeys } from '@lukemorales/query-key-factory';

type RecentProduct = {
  id: number;
  thumbnail: string;
  name: string;
  price: number;
};

type RecentProductResponse = {
  recentProducts: RecentProduct[];
};

export const recentProductQueries = createQueryKeys('recentProduct', {
  list: {
    queryKey: null,
    queryFn: () => http.get<RecentProductResponse>('/api/recent/product/list'),
  },
});
