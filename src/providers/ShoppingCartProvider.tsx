import type { Product } from '@/remotes/product';
import { createContext, useContext, useState, type ReactNode } from 'react';

export type CartItem = {
  product: Product;
  quantity: number;
};

type ShoppingCartState = {
  items: CartItem[];
};

type ShoppingCartActions = {
  addToShoppingCart: (product: Product, quantity?: number) => void; // 수량 넘기지 않을 경우 기본 동작: 1개 추가
  removeFromShoppingCart: (productId: number, quantity?: number) => void; // 수량 넘기지 않을 경우 기본 동작: 전체 삭제
};

// State, Action을 분리하여 정의함으로써, 액션만 사용하는 컴포넌트는 State가 변경되어도 리렌더링되지 않도록 설계
// States
const shoppingCartContext = createContext<ShoppingCartState>({
  items: [],
});

// Actions
const shoppingCartActionContext = createContext<ShoppingCartActions>({
  addToShoppingCart: () => {},
  removeFromShoppingCart: () => {},
});

const ShoppingCartProvider = ({ children }: { children: ReactNode }) => {
  const [shoppingCartItems, setShoppingCartItems] = useState<CartItem[]>([]);

  const addToShoppingCart = (product: Product, quantity = 1) => {
    setShoppingCartItems(prev => {
      const existingItem = shoppingCartItems.find(item => item.product.id === product.id);

      if (existingItem) {
        // 수량만 조정
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        // 새 아이템 추가
        return [...prev, { product, quantity }];
      }
    });
  };

  // 수량 조정, 아이템 삭제 2개를 하고 있으니 분리하는 것도 좋다. -> 테스트 코드 짜기 어려운지를 기준으로 삼아보기
  const removeFromShoppingCart = (productId: number, quantity?: number) => {
    setShoppingCartItems(prev => {
      const existingItem = prev.find(item => item.product.id === productId);

      if (!existingItem) {
        return prev;
      }

      const newQuantity = quantity ? existingItem.quantity - quantity : 0;

      if (newQuantity > 0) {
        // 수량만 조정
        return prev.map(item => (item.product.id === productId ? { ...item, quantity: newQuantity } : item));
      } else {
        // 아이템 삭제
        return prev.filter(item => item.product.id !== productId);
      }
    });
  };

  return (
    <shoppingCartContext.Provider value={{ items: shoppingCartItems }}>
      <shoppingCartActionContext.Provider value={{ addToShoppingCart, removeFromShoppingCart }}>
        {children}
      </shoppingCartActionContext.Provider>
    </shoppingCartContext.Provider>
  );
};

const useShoppingCartState = () => {
  return useContext(shoppingCartContext);
};

const useShoppingCartActions = () => {
  return useContext(shoppingCartActionContext);
};

export { ShoppingCartProvider, useShoppingCartState, useShoppingCartActions };
