import { queryOptions } from '@tanstack/react-query';
import { getProductDetail, getProductList, getRecentProductList, getRecommendProductIds } from '../fetchers/product';

export const getRecentProductListQueryOptions = queryOptions({
  queryKey: ['recent-product-list'],
  queryFn: getRecentProductList,
});

export const getProductListQueryOptions = queryOptions({
  queryKey: ['product-list'],
  queryFn: getProductList,
});

export const getProductDetailQueryOptions = (id: number) =>
  queryOptions({
    queryKey: ['product-detail', id],
    queryFn: () => getProductDetail(id),
  });

export const getRecommendProductIdsQueryOptions = (id: number) =>
  queryOptions({
    queryKey: ['recommend-product-ids', id],
    queryFn: () => getRecommendProductIds(id),
  });
