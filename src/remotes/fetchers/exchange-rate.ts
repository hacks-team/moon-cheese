import { http } from '@/utils/http';

type ExchangeRateResponse = {
  exchangeRate: {
    KRW: number;
    USD: number;
  };
};

export const getExchangeRate = () => http.get<ExchangeRateResponse>('/api/exchange-rate');
