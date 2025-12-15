import { createContext, useContext, useState } from 'react';
import { type Product } from '@/lib/types/products';

type ShoppingCartContextType = {
  shoppingCart: Product[];
  setShoppingCart: React.Dispatch<React.SetStateAction<Product[]>>;
};

const shoppingCartContext = createContext<Pick<ShoppingCartContextType, 'shoppingCart'>>({
  shoppingCart: [],
});

const shoppingCartActionContext = createContext<Pick<ShoppingCartContextType, 'setShoppingCart'>>({
  setShoppingCart: () => {},
});

const ShoppingCartProvider = ({ children }: { children: React.ReactNode }) => {
  const [shoppingCart, setShoppingCart] = useState<Product[]>([]);
  return (
    <shoppingCartContext.Provider value={{ shoppingCart }}>
      <shoppingCartActionContext.Provider value={{ setShoppingCart }}>{children}</shoppingCartActionContext.Provider>
    </shoppingCartContext.Provider>
  );
};

const useShoppingCart = () => {
  return useContext(shoppingCartContext);
};

const useSetShoppingCart = () => {
  return useContext(shoppingCartActionContext);
};

export { ShoppingCartProvider, useShoppingCart, useSetShoppingCart };
