import type { CurrencyType, GradePointListItem } from '@/lib/types';

export type ExchangeRateResponse = {
  exchangeRate: {
    [key in CurrencyType]: number;
  };
};

export type GradePointListResponse = {
  gradePointList: GradePointListItem[];
};
