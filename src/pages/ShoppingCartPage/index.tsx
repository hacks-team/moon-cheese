import { ErrorBoundary } from '@suspensive/react';
import { Suspense } from 'react';
import ErrorSection from '@/components/ErrorSection';
import { useCart } from '@/provider/cart-provider';
import CheckoutSection from './components/CheckoutSection';
import DeliveryMethodSection from './components/DeliveryMethodSection';
import EmptyCartSection from './components/EmptyCartSection';
import ShoppingCartSection from './components/ShoppingCartSection';

function ShoppingCartPageContainer() {
  const { cartItems } = useCart();

  if (cartItems.length === 0) {
    return <EmptyCartSection />;
  }

  return (
    <>
      <ShoppingCartSection />
      <DeliveryMethodSection />
      <CheckoutSection />
    </>
  );
}

function ShoppingCartPage() {
  return (
    <ErrorBoundary fallback={<ErrorSection />}>
      <Suspense>
        <ShoppingCartPageContainer />
      </Suspense>
    </ErrorBoundary>
  );
}

export default ShoppingCartPage;
