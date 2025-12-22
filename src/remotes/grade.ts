import type { GradePoint, GradeShippingList } from '@/type';
import { http } from '@/utils/http';

interface GetGradePoint {
  gradePointList: GradePoint[];
}
export const getGrade = async () => {
  const response = await http.get<GetGradePoint>('/api/grade/point');
  return response;
};

interface GetGradeShipping {
  gradeShippingList: GradeShippingList[];
}

export const getGradeShippingList = async () => {
  const response = await http.get<GetGradeShipping>('/api/grade/shipping');
  return response;
};
