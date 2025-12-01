import { queryOptions } from '@tanstack/react-query';
import { getRecentProductList } from '../product';

export const getRecentProductListQueryOptions = () =>
  queryOptions({
    queryKey: ['recent-product-list'],
    queryFn: getRecentProductList,
  });
