import { useSuspenseQuery } from '@tanstack/react-query';
import { createContext, useContext, useState } from 'react';
import { getExchangeRateQueryOptions } from '@/remotes/queries/exchange';
import type { Currency } from '@/type';

type CurrencyContextType = {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
};

const currencyContext = createContext<Pick<CurrencyContextType, 'currency'>>({
  currency: 'USD',
});

const currencyActionContext = createContext<Pick<CurrencyContextType, 'setCurrency'>>({
  setCurrency: () => {},
});

const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrency] = useState<Currency>('USD');
  return (
    <currencyContext.Provider value={{ currency }}>
      <currencyActionContext.Provider value={{ setCurrency }}>{children}</currencyActionContext.Provider>
    </currencyContext.Provider>
  );
};

const useCurrency = () => {
  return useContext(currencyContext);
};

const useSetCurrency = () => {
  return useContext(currencyActionContext);
};

export { CurrencyProvider, useCurrency, useSetCurrency };
