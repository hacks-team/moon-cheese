import type { Grade, GradeShippingList } from '@/type';
import { isNil } from 'es-toolkit';

export function getDeliveryFee(gradeShippingList: GradeShippingList[], grade: Grade, totalPrice: number) {
  const currentGradeShipping = gradeShippingList.find(gradeShipping => gradeShipping.type === grade);

  if (isNil(currentGradeShipping)) throw new Error('OH MY GOSH!');

  const { shippingFee, freeShippingThreshold } = currentGradeShipping;

  if (totalPrice >= freeShippingThreshold) return 0;

  return shippingFee;
}
