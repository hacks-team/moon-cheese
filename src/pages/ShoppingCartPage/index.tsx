import { useCart } from '@/providers/cart-provider';
import CheckoutSection from './components/CheckoutSection';
import DeliveryMethodSection from './components/DeliveryMethodSection';
import ShoppingCartSection from './components/ShoppingCartSection';
import EmptyCartSection from './components/EmptyCartSection';
import { Suspense, useState } from 'react';
import { useSuspenseQueries } from '@tanstack/react-query';
import { getGradeShippingListQueryOptions } from '@/remotes/queries/grade';
import { getMeQueryOptions } from '@/remotes/queries/me';
import { getDeliveryFee } from '@/domain/delivery';

function ShoppingCartPage() {
  const { carts } = useCart();
  if (carts.length === 0) return <EmptyCartSection />;

  return (
    <>
      <ShoppingCartSection />
      <Suspense>
        <DeliveryCheckoutSection />
      </Suspense>
    </>
  );
}

export default ShoppingCartPage;

function DeliveryCheckoutSection() {
  const { carts } = useCart();
  const [
    {
      data: { gradeShippingList },
    },
    {
      data: { grade },
    },
  ] = useSuspenseQueries({ queries: [getGradeShippingListQueryOptions(), getMeQueryOptions()] });

  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState<'EXPRESS' | 'PREMIUM'>('EXPRESS');
  const cartTotalPrice = carts.reduce((acc, cur) => acc + cur.price, 0);
  const deliveryFee = getDeliveryFee(gradeShippingList, grade, cartTotalPrice);

  return (
    <>
      <DeliveryMethodSection
        value={selectedDeliveryMethod}
        onSelect={setSelectedDeliveryMethod}
        deliveryFee={deliveryFee}
      />
      <CheckoutSection totalPrice={cartTotalPrice} deliveryMethod={selectedDeliveryMethod} deliveryFee={deliveryFee} />
    </>
  );
}
