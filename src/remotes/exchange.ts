import { http } from '@/utils/http';

interface ExchangeRateResponse {
  exchangeRate: {
    KRW: number;
    USD: number;
  };
}

export const getExchangeRate = async () => {
  const response = await http.get<ExchangeRateResponse>('/api/exchange-rate');
  return response;
};
