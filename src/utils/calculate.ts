import type { CurrencyType, GradePointListItem } from '@/lib/types';

export const convertCurrencyPrice = (
  price: number,
  currency: CurrencyType,
  exchangeRate: { [key in CurrencyType]: number }
): number => {
  if (currency === 'USD') {
    return price;
  }

  return Math.round(price * exchangeRate[currency]);
};

export const calculateNextGrade = (
  point: number,
  gradePointList: GradePointListItem[]
): GradePointListItem | undefined => {
  const nextGrade = gradePointList.find(item => item.minPoint > point);

  return nextGrade;
};

export const calculateGradeProgress = (point: number, gradePointList: GradePointListItem[]): number => {
  const nextGrade = calculateNextGrade(point, gradePointList);

  if (!nextGrade) {
    return 1;
  }

  return Math.round((point / nextGrade.minPoint) * 100) / 100;
};

export const pointsToNextGrade = (point: number, gradePointList: GradePointListItem[]): number => {
  const nextGrade = calculateNextGrade(point, gradePointList);

  if (!nextGrade) {
    return 0;
  }

  return nextGrade.minPoint - point;
};
