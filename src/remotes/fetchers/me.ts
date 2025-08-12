import type { Grade, GradePoint, GradeShipping, PurchaseRequest } from '@/types';
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

type GetGradeShippingResponse = {
  gradeShippingList: GradeShipping[];
};

export const getGradeShipping = () => http.get<GetGradeShippingResponse>('/api/grade/shipping');

export const purchaseProducts = (purchaseData: PurchaseRequest) =>
  http.post<PurchaseRequest>('/api/product/purchase', purchaseData);
