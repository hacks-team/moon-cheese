import { queries } from '@/queries';
import type { GradeShipping } from '@/queries/grade';
import type { ExchangeRate } from '@/types/currency';
import { useSuspenseQueries } from '@tanstack/react-query';
import { calculateDeliveryPrices, findGradeShipping } from '../utils/shipping';

export interface DeliveryPricingData {
  expressPrice: number;
  premiumPrice: number;
  gradeShipping: GradeShipping | undefined;
  exchangeRate: ExchangeRate;
}

/** 배송비 관련 데이터 조회 + 계산 (Provider 내부 전용) */
export function useDeliveryPricingQuery(): DeliveryPricingData {
  const [{ data: userData }, { data: gradeShippingData }, { data: exchangeRateData }] = useSuspenseQueries({
    queries: [queries.user.me, queries.grade.shipping, queries.exchangeRate.current],
  });

  // 데이터 파이프라인 레이어 (복잡도 증가시 분리 필요)
  const gradeShipping = findGradeShipping(userData.grade, gradeShippingData.gradeShippingList);
  const { expressPrice, premiumPrice } = calculateDeliveryPrices(gradeShipping);

  return {
    expressPrice,
    premiumPrice,
    gradeShipping,
    exchangeRate: exchangeRateData.exchangeRate,
  };
}
