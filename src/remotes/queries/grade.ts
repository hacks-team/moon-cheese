import { queryOptions } from '@tanstack/react-query';
import { getGradePoint } from '../grade';

/**
 * 등급 쿼리 키
 */
export const gradePointQueryKeys = {
  gradePoint: () => ['grade', 'point'],
};

/**
 * 등급 쿼리 옵션
 */
export const gradePointQueryOptions = {
  // 실제 쿼리 옵션
  gradePoint: () =>
    queryOptions({
      queryKey: gradePointQueryKeys.gradePoint(),
      queryFn: getGradePoint,
    }),
};
