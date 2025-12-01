import { queryOptions } from '@tanstack/react-query';
import { getMe } from '../me';

export const getMeQueryOptions = () =>
  queryOptions({
    queryKey: ['me'],
    queryFn: getMe,
  });
