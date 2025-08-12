import { queryOptions } from '@tanstack/react-query';
import { getGradeShipping, getMe } from '../fetchers/me';

export const getMeQueryOptions = queryOptions({ queryKey: ['me'], queryFn: getMe });

export const getGradeShippingQueryOptions = queryOptions({
  queryKey: ['grade-shipping'],
  queryFn: getGradeShipping,
});
