import { queryOptions } from '@tanstack/react-query';
import { getExchangeRate } from '../exchange';

export const getExchangeRateQueryOptions = () =>
  queryOptions({
    queryKey: ['exchange-rate'],
    queryFn: getExchangeRate,
  });
