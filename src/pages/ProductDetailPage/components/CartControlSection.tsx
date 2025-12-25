import { useCartValue } from '@/providers/CartProvider';
import { styled } from 'styled-system/jsx';
import CartControls from './CartControls';

type CartControlSectionProps = {
  productId: number;
  stock: number;
};

function CartControlSection({ productId, stock }: CartControlSectionProps) {
  const { getQuantity } = useCartValue();
  const cartQuantity = getQuantity(productId);
  const isInCart = cartQuantity > 0;

  return (
    <styled.section css={{ bg: 'background.01_white', px: 5, pb: 5 }}>
      {isInCart ? (
        <CartControls.Remove productId={productId} stock={stock} cartQuantity={cartQuantity} />
      ) : (
        <CartControls.Add productId={productId} stock={stock} />
      )}
    </styled.section>
  );
}

export default CartControlSection;
