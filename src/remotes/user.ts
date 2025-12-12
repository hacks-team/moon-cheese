import type { Grade } from '@/constants/grade';
import { http } from '@/utils/http';

export const getMe = async () => await http.get<Me>('/api/me');

// Type, Interface
export type Me = {
  point: number;
  grade: Grade;
};
