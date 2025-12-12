import { queryOptions } from '@tanstack/react-query';
import { getExchangeRate } from '../exchange';

/**
 * 환율 쿼리 키
 */
export const exchangeQueryKeys = {
  exchangeRate: () => ['exchange-rate'],
};

/**
 * 환율 쿼리 옵션
 */
export const exchangeQueryOptions = {
  exchangeRate: () =>
    queryOptions({
      queryKey: [...exchangeQueryKeys.exchangeRate()],
      queryFn: getExchangeRate,
      staleTime: 0, // 환율은 매번 최신 정보 패치
    }),
};
