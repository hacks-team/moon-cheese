import { queryOptions } from '@tanstack/react-query';
import { getGrade } from '../grade';

export const getGradeQueryOptions = () =>
  queryOptions({
    queryKey: ['grade'],
    queryFn: getGrade,
  });
