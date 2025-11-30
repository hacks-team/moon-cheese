import type { ExchangeRate } from '@/types/currency';
import { http } from '@/utils/http';
import { createQueryKeys } from '@lukemorales/query-key-factory';

type ExchangeRateResponse = {
  exchangeRate: ExchangeRate;
};

export const exchangeRateQueries = createQueryKeys('exchangeRate', {
  current: {
    queryKey: null,
    queryFn: () => http.get<ExchangeRateResponse>('/api/exchange-rate'),
  },
});
