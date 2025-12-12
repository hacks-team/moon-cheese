import { queryOptions } from '@tanstack/react-query';
import { getProductDetail, getProductList, getRecentProductList, getRecommendProductIds } from '../product';

/**
 * Product 쿼리 키
 */
export const productQueryKeys = {
  all: () => ['product'],
  productList: () => [...productQueryKeys.all(), 'list'],
  detail: (productId: number) => [...productQueryKeys.all(), 'detail', productId],

  recentProductList: () => [...productQueryKeys.all(), 'recent'],

  recommendProductIds: (productId: number) => [...productQueryKeys.all(), 'recommend', productId],
};

/**
 * Product 쿼리 옵션
 */
export const productQueryOptions = {
  productList: () =>
    queryOptions({
      queryKey: productQueryKeys.productList(),
      queryFn: getProductList,
    }),

  productDetail: (productId: number) =>
    queryOptions({
      queryKey: productQueryKeys.detail(productId),
      queryFn: () => getProductDetail(productId),
    }),

  recentProductList: () =>
    queryOptions({
      queryKey: productQueryKeys.recentProductList(),
      queryFn: getRecentProductList,
    }),

  recommendProductIds: (productId: number) =>
    queryOptions({
      queryKey: productQueryKeys.recommendProductIds(productId),
      queryFn: () => getRecommendProductIds(productId),
    }),
};
