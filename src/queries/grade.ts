import type { GradeType } from '@/coreBusiness/grade';
import { http } from '@/utils/http';
import { createQueryKeys } from '@lukemorales/query-key-factory';

export type GradePoint = {
  type: GradeType;
  minPoint: number;
};

type GradePointResponse = {
  gradePointList: GradePoint[];
};

export type GradeShipping = {
  type: GradeType;
  shippingFee: number;
  freeShippingThreshold: number;
};

type GradeShippingResponse = {
  gradeShippingList: GradeShipping[];
};

export const gradeQueries = createQueryKeys('grade', {
  point: {
    queryKey: null,
    queryFn: () => http.get<GradePointResponse>('/api/grade/point'),
  },
  shipping: {
    queryKey: null,
    queryFn: () => http.get<GradeShippingResponse>('/api/grade/shipping'),
  },
});
