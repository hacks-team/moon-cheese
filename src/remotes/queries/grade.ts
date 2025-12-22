import { queryOptions } from '@tanstack/react-query';
import { getGrade, getGradeShippingList } from '../grade';

export const getGradeQueryOptions = () =>
  queryOptions({
    queryKey: ['grade'],
    queryFn: getGrade,
  });

export const getGradeShippingListQueryOptions = () =>
  queryOptions({
    queryKey: ['grade-shipping'],
    queryFn: getGradeShippingList,
  });
