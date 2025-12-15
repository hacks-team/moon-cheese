import { http } from '@/utils/http';
import type { UserInfoResponse } from './user.type';

export const getUserInfo = async (): Promise<UserInfoResponse> => {
  const response = await http.get<UserInfoResponse>('/api/me');

  return response;
};
