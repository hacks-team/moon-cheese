import { useQuery } from '@tanstack/react-query';
import { getUserInfo } from './user.api';
import type { GradeType } from '@/lib/types';

export const useUserInfo = () => {
  return useQuery({
    queryKey: ['userInfo'],
    queryFn: getUserInfo,
    initialData: {
      point: 0,
      grade: 'EXPLORER' as GradeType,
    },
  });
};
