import { type Product } from '@/lib/types/products';

export const getItemQuantity = (cart: Product[], product: Product): number => {
  return cart.filter(item => item.id === product.id).length;
};

export const isMoreThanStock = (cart: Product[], product: Product): boolean => {
  return getItemQuantity(cart, product) >= product.stock;
};

export const isLessThanStock = (cart: Product[], product: Product): boolean => {
  return getItemQuantity(cart, product) <= 0;
};
