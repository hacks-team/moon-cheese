import { useShoppingCart, useSetShoppingCart } from '@/providers/ShoppingCartProvider';
import { type Product } from '@/lib/types/products';
import { getItemQuantity, isMoreThanStock, isLessThanStock } from '@/utils/shoppingCart';

export const useShoppingCartController = () => {
  const { shoppingCart } = useShoppingCart();
  const { setShoppingCart } = useSetShoppingCart();

  const addItem = (product: Product): void => {
    setShoppingCart(prev => [...prev, product]);
  };

  const addItems = (products: Product[]): void => {
    setShoppingCart(prev => [...prev, ...products]);
  };

  const removeItem = (productId: number): void => {
    setShoppingCart(prev => {
      const findIndex = prev.map(item => item.id).lastIndexOf(productId);

      if (findIndex === -1) {
        return prev;
      }

      return [...prev.slice(0, findIndex), ...prev.slice(findIndex + 1)];
    });
  };

  const removeItems = (productId: number): void => {
    setShoppingCart(prev => {
      return prev.filter(item => item.id !== productId);
    });
  };

  const readItemQuantity = (product: Product): number => {
    return getItemQuantity(shoppingCart, product);
  };

  const isItemMoreThanStock = (product: Product): boolean => {
    return isMoreThanStock(shoppingCart, product);
  };

  const isItemLessThanStock = (product: Product): boolean => {
    return isLessThanStock(shoppingCart, product);
  };

  return {
    shoppingCart,
    addItem,
    addItems,
    removeItem,
    removeItems,
    readItemQuantity,
    isItemMoreThanStock,
    isItemLessThanStock,
  };
};
