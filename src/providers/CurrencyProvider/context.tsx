import { createContext, useContext } from 'react';
import { type CurrencyType } from '@/ui-lib/components/currency-toggle';

type CurrencyContextValue = {
  currency: CurrencyType;
  setCurrency: (currency: CurrencyType) => void;
};

export const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export const useCurrencyContext = () => {
  const context = useContext(CurrencyContext);

  if (!context) {
    throw new Error('useCurrencyContext must be used within a CurrencyContextProvider');
  }
  return context;
};
