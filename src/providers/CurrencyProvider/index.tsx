import { useState } from 'react';
import { CurrencyContext, useCurrencyContext } from './context';
import { type CurrencyType } from '@/ui-lib/components/currency-toggle';

const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrency] = useState<CurrencyType>('USD');

  return <CurrencyContext.Provider value={{ currency, setCurrency }}>{children}</CurrencyContext.Provider>;
};

export { CurrencyProvider, useCurrencyContext };
