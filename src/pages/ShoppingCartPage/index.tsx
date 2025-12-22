import { useCartValue } from '@/providers/CartProvider';
import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import CheckoutSection from './components/CheckoutSection';
import DeliveryMethodSection from './components/DeliveryMethodSection';
import EmptyCartSection from './components/EmptyCartSection';
import ShoppingCartSection from './components/ShoppingCartSection';
import { DeliveryPricingProvider } from './providers/DeliveryPricingProvider';

function ShoppingCartPage() {
  const { items } = useCartValue();

  if (items.length === 0) {
    return <EmptyCartSection />;
  }

  return (
    <>
      <Suspense fallback={<ShoppingCartSection.Skeleton />}>
        <ErrorBoundary FallbackComponent={ShoppingCartSection.Error}>
          <ShoppingCartSection />
        </ErrorBoundary>
      </Suspense>
      <DeliveryCheckoutSection />
    </>
  );
}

export type DeliveryType = 'EXPRESS' | 'PREMIUM';

/** 배송 + 결제 섹션 - DeliveryPricingProvider로 데이터 공유 */
function DeliveryCheckoutSection() {
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('EXPRESS');

  return (
    <Suspense fallback={<DeliveryMethodSection.Skeleton />}>
      <ErrorBoundary FallbackComponent={DeliveryMethodSection.Error}>
        <DeliveryPricingProvider>
          <DeliveryMethodSection selectedDeliveryType={deliveryType} onDeliveryChange={setDeliveryType} />
          <CheckoutSection deliveryType={deliveryType} />
        </DeliveryPricingProvider>
      </ErrorBoundary>
    </Suspense>
  );
}

export default ShoppingCartPage;
