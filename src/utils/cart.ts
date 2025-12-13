import type { CartItem } from '@/type';

export const getCartCount = (productId: number, carts: CartItem[]) => {
  return carts.filter(cart => cart.id === productId).length;
};
