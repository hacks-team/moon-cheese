import { createContext, type ReactNode, use, useState } from 'react';
import type { CartItem } from '@/types';

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number, quantity: number) => void;
  getCartItemQuantity: (productId: number) => number;
  getTotalCartQuantity: () => number;
  clearCart: () => void;
  clearCartItem: (productId: number) => void;
};

const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  getCartItemQuantity: () => 0,
  getTotalCartQuantity: () => 0,
  clearCart: () => {},
  clearCartItem: () => {},
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (productId: number, quantity: number) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.productId === productId);

      if (existingItem) {
        return prevItems.map(item =>
          item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [...prevItems, { productId, quantity }];
      }
    });
  };

  const removeFromCart = (productId: number, quantity: number) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.productId === productId);

      if (!existingItem) {
        return prevItems;
      }

      const newQuantity = existingItem.quantity - quantity;

      if (newQuantity <= 0) {
        return prevItems.filter(item => item.productId !== productId);
      } else {
        return prevItems.map(item => (item.productId === productId ? { ...item, quantity: newQuantity } : item));
      }
    });
  };

  const getCartItemQuantity = (productId: number) => {
    const item = cartItems.find(item => item.productId === productId);
    return item ? item.quantity : 0;
  };

  const getTotalCartQuantity = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const clearCartItem = (productId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.productId !== productId));
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        getCartItemQuantity,
        getTotalCartQuantity,
        clearCart,
        clearCartItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = use(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
