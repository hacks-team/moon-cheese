import { queryOptions } from '@tanstack/react-query';
import { getMe } from '../user';

/**
 * 유저 쿼리 키
 */
export const userQueryKeys = {
  me: () => ['me'],
};

/**
 * 유저 쿼리 옵션
 */
export const userQueryOptions = {
  me: () =>
    queryOptions({
      queryKey: userQueryKeys.me(),
      queryFn: getMe,
    }),
};
