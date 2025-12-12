import { http } from '@/utils/http';

export const getExchangeRate = async () => {
  const response = await http.get<ExchangeRateResponse>('/api/exchange-rate');
  return response.exchangeRate;
};

// Type, Interface
export type ExchangeRate = {
  KRW: number;
  USD: number;
};

// DTO
type ExchangeRateResponse = {
  exchangeRate: ExchangeRate;
};
