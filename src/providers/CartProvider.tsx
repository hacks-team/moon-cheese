import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

// 장바구니 아이템 타입
export interface CartItem {
  productId: number;
  quantity: number;
}

// Value Context: 상태 값 (구독하면 상태 변경시 리렌더링)
interface CartValueContextType {
  items: CartItem[];
  totalQuantity: number;
  // 이 경우 부분 아이템 조회 변경만 필요한 경우가 있으므로 함수로 사용
  getQuantity: (productId: number) => number;
}

// Action Context: 액션 함수들 (구독해도 리렌더링 없음)
interface CartActionContextType {
  increaseQuantity: (productId: number) => void;
  decreaseQuantity: (productId: number) => void;
  addItemWithQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
}

const CartValueContext = createContext<CartValueContextType | null>(null);
const CartActionContext = createContext<CartActionContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const valueContext: CartValueContextType = useMemo(
    () => ({
      items,
      totalQuantity: calculateTotalQuantity(items),
      getQuantity: (productId: number) => findItem(items, productId)?.quantity ?? 0,
    }),
    [items] // item에 의존성 걸려있어 상태 변경시 리렌더링 됨
  );

  const actionContext: CartActionContextType = useMemo(
    () => ({
      increaseQuantity: (productId: number) => {
        setItems(prev => {
          const existing = findItem(prev, productId);
          return existing ? updateQuantity(prev, productId, 1) : addNewItem(prev, productId);
        });
      },

      decreaseQuantity: (productId: number) => {
        setItems(prev => {
          const existing = findItem(prev, productId);
          if (!existing) {
            return prev;
          }

          const isLastOne = existing.quantity === 1;
          return isLastOne ? removeItemFromCart(prev, productId) : updateQuantity(prev, productId, -1);
        });
      },

      addItemWithQuantity: (productId: number, quantity: number) => {
        if (quantity <= 0) {
          return;
        }
        setItems(prev => {
          const existing = findItem(prev, productId);
          return existing ? updateQuantity(prev, productId, quantity) : [...prev, { productId, quantity }];
        });
      },

      removeFromCart: (productId: number) => {
        setItems(prev => removeItemFromCart(prev, productId));
      },

      clearCart: () => setItems([]),
    }),
    [] // actionContext는 상태 변경시 리렌더링 안됨
  );

  return (
    <CartActionContext.Provider value={actionContext}>
      <CartValueContext.Provider value={valueContext}>{children}</CartValueContext.Provider>
    </CartActionContext.Provider>
  );
}

// Value만 필요할 때 사용 (상태 변경시 리렌더링됨)
export function useCartValue() {
  const context = useContext(CartValueContext);
  if (!context) {
    throw new Error('useCartValue must be used within CartProvider');
  }
  return context;
}

// Action만 필요할 때 사용 (상태 변경시 리렌더링 안됨)
export function useCartAction() {
  const context = useContext(CartActionContext);
  if (!context) {
    throw new Error('useCartAction must be used within CartProvider');
  }
  return context;
}

function findItem(items: CartItem[], productId: number) {
  return items.find(item => item.productId === productId);
}

function updateQuantity(items: CartItem[], productId: number, delta: number): CartItem[] {
  return items.map(item => {
    if (item.productId !== productId) {
      return item;
    }
    return { ...item, quantity: item.quantity + delta };
  });
}

function removeItemFromCart(items: CartItem[], productId: number): CartItem[] {
  return items.filter(item => item.productId !== productId);
}

function addNewItem(items: CartItem[], productId: number): CartItem[] {
  return [...items, { productId, quantity: 1 }];
}

function calculateTotalQuantity(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
