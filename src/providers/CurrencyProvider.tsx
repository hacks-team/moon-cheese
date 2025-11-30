import type { CurrencyType } from '@/ui-lib';
import { createContext, useContext, useState, type ReactNode } from 'react';

type CurrencyContextValue = readonly [CurrencyType, (currency: CurrencyType) => void];

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<CurrencyType>('USD');

  return <CurrencyContext.Provider value={[currency, setCurrency]}>{children}</CurrencyContext.Provider>;
}

export function useCurrencyContext() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrencyContext must be used within CurrencyProvider');
  }
  return context;
}
