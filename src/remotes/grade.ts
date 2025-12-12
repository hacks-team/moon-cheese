import type { Grade } from '@/constants/grade';
import { http } from '@/utils/http';

export const getGradePoint = async () => {
  const response = await http.get<GradePointResponse>('/api/grade/point');
  return response.gradePointList;
};

// Type, Interface
export type GradePoint = {
  type: Grade;
  minPoint: number;
};

// DTO
type GradePointResponse = {
  gradePointList: GradePoint[];
};
