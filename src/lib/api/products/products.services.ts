import { getRecentProductList, getProductList, getProductDetail, getRecommendedProductList } from './products.api';
import { useQuery, useQueries } from '@tanstack/react-query';

export const useRecentProductList = () => {
  return useQuery({
    queryKey: ['recentProductList'],
    queryFn: getRecentProductList,
    initialData: [],
  });
};

export const useProductList = () => {
  return useQuery({
    queryKey: ['productList'],
    queryFn: getProductList,
    initialData: [],
  });
};

export const useProductDetail = (id: number) => {
  return useQuery({
    queryKey: ['productDetail', id],
    queryFn: () => getProductDetail(id),
    initialData: {
      id: 0,
      name: '',
      category: 'CHEESE',
      stock: 0,
      price: 0,
      description: '',
      detailDescription: '',
      images: [],
      rating: 0,
    },
  });
};

export const useRecommendedProductList = (id: number) => {
  return useQuery({
    queryKey: ['recommendedProductList', id],
    queryFn: () => getRecommendedProductList(id),
    initialData: [],
  });
};

export const useRecommendedProductDetails = (productIds: number[]) => {
  return useQueries({
    queries: productIds.map(productId => ({
      queryKey: ['recommendedProductDetail', productId],
      queryFn: () => getProductDetail(productId),
      enabled: productIds.length > 0,
    })),
  });
};
