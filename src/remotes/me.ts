import type { Grade } from '@/type';
import { http } from '@/utils/http';

interface MeResponse {
  point: number;
  grade: Grade;
}

export const getMe = async () => {
  const response = await http.get<MeResponse>('/api/me');
  return response;
};
