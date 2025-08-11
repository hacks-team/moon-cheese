import { queryOptions } from '@tanstack/react-query';
import { getProductList, getRecentProductList } from '../fetchers/product';

export const getRecentProductListQueryOptions = queryOptions({
  queryKey: ['recent-product-list'],
  queryFn: getRecentProductList,
});

export const getProductListQueryOptions = queryOptions({
  queryKey: ['product-list'],
  queryFn: getProductList,
});
