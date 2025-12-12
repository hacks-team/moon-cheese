import type { CurrencyType } from '@/ui-lib/components/currency-toggle';
import { createContext, useContext, useState, type ReactNode } from 'react';

interface CurrencyContextType {
  currency: CurrencyType;
  setCurrency: (Currency: CurrencyType) => void;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState<CurrencyType>('USD');

  return <CurrencyContext.Provider value={{ currency, setCurrency }}>{children}</CurrencyContext.Provider>;
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }

  return context;
};
