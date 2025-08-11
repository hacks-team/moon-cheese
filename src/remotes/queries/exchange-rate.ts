import { queryOptions } from '@tanstack/react-query';
import { getExchangeRate } from '../fetchers/exchange-rate';

export const getExchangeRateQueryOptions = queryOptions({
  queryKey: ['exchange-rate'],
  queryFn: getExchangeRate,
});
