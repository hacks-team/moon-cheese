import type { ExchangeRate } from '@/type';
import { http } from '@/utils/http';

interface ExchangeRateResponse {
  exchangeRate: ExchangeRate;
}

export const getExchangeRate = async () => {
  const response = await http.get<ExchangeRateResponse>('/api/exchange-rate');
  return response;
};
