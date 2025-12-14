import { queryOptions } from '@tanstack/react-query';
import { getProductById, getProductList, getRecentProductList, getRecommendProductIdsByProductId } from '../product';

export const getRecentProductListQueryOptions = () =>
  queryOptions({
    queryKey: ['recent-product-list'],
    queryFn: getRecentProductList,
  });

export const getProductListQueryOptions = () =>
  queryOptions({
    queryKey: ['product-list'],
    queryFn: getProductList,
  });

export const getProductByIdQueryOptions = (productId: number) =>
  queryOptions({
    queryKey: ['product-by-id', productId],
    queryFn: () => getProductById(productId),
  });

export const getRecommendProductIdsByProductIdQueryOptions = (productId: number) =>
  queryOptions({
    queryKey: ['recommend-product-ids-by-product-id', productId],
    queryFn: () => getRecommendProductIdsByProductId(productId),
  });
