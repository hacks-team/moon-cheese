import type { GradeShipping } from '@/queries/grade';
import type { ExchangeRate } from '@/types/currency';
import { createContext, useContext, type ReactNode } from 'react';
import { useDeliveryPricingQuery } from '../hooks/useDeliveryPricing';

export interface DeliveryPricingData {
  expressPrice: number;
  premiumPrice: number;
  gradeShipping: GradeShipping | undefined;
  exchangeRate: ExchangeRate;
}

const DeliveryPricingContext = createContext<DeliveryPricingData | null>(null);

interface DeliveryPricingProviderProps {
  children: ReactNode;
}

/** 배송비 데이터 Provider - Suspense boundary 내에서 사용 */
export function DeliveryPricingProvider({ children }: DeliveryPricingProviderProps) {
  const deliveryPricing = useDeliveryPricingQuery();

  return <DeliveryPricingContext.Provider value={deliveryPricing}>{children}</DeliveryPricingContext.Provider>;
}

export function useDeliveryPricing(): DeliveryPricingData {
  const context = useContext(DeliveryPricingContext);
  if (!context) {
    throw new Error('useDeliveryPricing must be used within DeliveryPricingProvider');
  }
  return context;
}
