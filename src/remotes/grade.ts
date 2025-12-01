import type { GradePoint } from '@/type';
import { http } from '@/utils/http';

interface GetGradePoint {
  gradePointList: GradePoint[];
}
export const getGrade = async () => {
  const response = await http.get<GetGradePoint>('/api/grade/point');
  return response;
};
