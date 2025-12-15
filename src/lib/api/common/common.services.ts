import { getExchangeRate, getGradePointList } from './common.api';
import { useQuery } from '@tanstack/react-query';
import type { GradeType } from '@/lib/types';

export const useExchangeRate = () => {
  return useQuery({
    queryKey: ['exchangeRate'],
    queryFn: getExchangeRate,
    initialData: {
      KRW: 1,
      USD: 1,
    },
  });
};

export const useGradePointList = () => {
  return useQuery({
    queryKey: ['gradePointList'],
    queryFn: getGradePointList,
    initialData: [
      {
        type: 'EXPLORER' as GradeType,
        minPoint: 0,
      },
    ],
  });
};
