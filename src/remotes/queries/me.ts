import { queryOptions } from '@tanstack/react-query';
import { getMe } from '../fetchers/me';

export const getMeQueryOptions = queryOptions({ queryKey: ['me'], queryFn: getMe });
