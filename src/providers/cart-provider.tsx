import { createContext, use, useReducer } from 'react';
import type { CartItem, Product } from '@/type';

type CartContextType = {
  carts: CartItem[];
  addCart: (product: Product) => void;
  removeCart: (product: Product) => void;
  clearCart: (productId?: number) => void;
};

const CartContext = createContext<CartContextType>({
  carts: [],
  addCart: () => {},
  removeCart: () => {},
  clearCart: () => {},
});

type CartAction =
  | { type: 'ADD_CART'; payload: CartItem }
  | { type: 'REMOVE_CART'; payload: CartItem }
  | { type: 'CLEAR_CART'; payload?: number };

const cartReducer = (state: CartItem[], action: CartAction) => {
  switch (action.type) {
    case 'ADD_CART':
      return [...state, action.payload];
    case 'REMOVE_CART': {
      const currentIndex = state.findIndex(item => item.id === action.payload.id);
      if (currentIndex < 0) return state;
      return state.filter((_, index) => index !== currentIndex);
    }
    case 'CLEAR_CART': {
      const { payload: productId } = action;
      if (productId) {
        return state.filter(item => item.id !== productId);
      }
      return [];
    }
  }
};

const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [carts, dispatch] = useReducer(cartReducer, []);

  const addCart: CartContextType['addCart'] = product => {
    dispatch({ type: 'ADD_CART', payload: product });
  };

  const removeCart: CartContextType['removeCart'] = product => {
    dispatch({ type: 'REMOVE_CART', payload: product });
  };

  const clearCart: CartContextType['clearCart'] = productId => {
    dispatch({ type: 'CLEAR_CART', payload: productId });
  };

  return <CartContext.Provider value={{ carts, addCart, removeCart, clearCart }}>{children}</CartContext.Provider>;
};

const useCart = () => {
  return use(CartContext);
};

export { CartProvider, useCart };
