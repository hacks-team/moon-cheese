import type { Grade, GradePoint } from '@/types';
import { http } from '@/utils/http';

type GetMeResponse = {
  point: number;
  grade: Grade;
};

export const getMe = () => http.get<GetMeResponse>('/api/me');

type GetGradePointResponse = {
  gradePointList: GradePoint[];
};

export const getGradePoint = () => http.get<GetGradePointResponse>('/api/grade/point');
