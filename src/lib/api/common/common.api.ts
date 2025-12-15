import { http } from '@/utils/http';
import type { ExchangeRateResponse, GradePointListResponse } from './common.type';

export const getExchangeRate = async (): Promise<ExchangeRateResponse['exchangeRate']> => {
  const response = await http.get<ExchangeRateResponse>('/api/exchange-rate');

  return response.exchangeRate;
};

export const getGradePointList = async (): Promise<GradePointListResponse['gradePointList']> => {
  const response = await http.get<GradePointListResponse>('/api/grade/point');

  return response.gradePointList;
};
