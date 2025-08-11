import { useSuspenseQuery } from '@tanstack/react-query';
import { createContext, Suspense, use, useState } from 'react';
import { getExchangeRateQueryOptions } from '@/remotes/queries/exchange-rate';

type CurrencyContextType = {
  currency: 'KRW' | 'USD';
  changeCurrency: (currency: 'KRW' | 'USD') => void;
  exchangeRate: number;
};

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'KRW',
  changeCurrency: () => {},
  exchangeRate: 0,
});

const CurrencyProviderContainer = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrency] = useState<'KRW' | 'USD'>('USD');
  const {
    data: { exchangeRate },
  } = useSuspenseQuery(getExchangeRateQueryOptions);

  return (
    <CurrencyContext.Provider value={{ currency, changeCurrency: setCurrency, exchangeRate: exchangeRate[currency] }}>
      {children}
    </CurrencyContext.Provider>
  );
};

const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense>
      <CurrencyProviderContainer>{children}</CurrencyProviderContainer>
    </Suspense>
  );
};

const useCurrency = () => {
  const context = use(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export { useCurrency, CurrencyProvider };
