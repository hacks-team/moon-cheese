import type { CurrencyType, GradeType } from '@/lib/types';

export const formatCurrencyPrice = (price: number, currency: CurrencyType): string => {
  if (currency === 'USD') {
    return `$${price.toLocaleString('en-US')}`;
  }

  return `${price.toLocaleString('ko-KR')}원`;
};

export const formatGrade = (grade: GradeType): string => {
  return grade.charAt(0).toUpperCase() + grade.slice(1).toLowerCase();
};
