import type { GradeType } from '@/coreBusiness/grade';
import { http } from '@/utils/http';
import { createQueryKeys } from '@lukemorales/query-key-factory';

type UserResponse = {
  point: number;
  grade: GradeType;
};

export const userQueries = createQueryKeys('user', {
  me: {
    queryKey: null,
    queryFn: () => http.get<UserResponse>('/api/me'),
  },
});
