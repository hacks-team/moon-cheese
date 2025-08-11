import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { EnhancedToastProvider } from '@/ui-lib/components/toast';
import { CartProvider } from './cart-provider';
import { CurrencyProvider } from './currency-provider';

const client = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
    },
  },
});

const GlobalProvider = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={client}>
      <CurrencyProvider>
        <CartProvider>
          <EnhancedToastProvider>{children}</EnhancedToastProvider>
        </CartProvider>
      </CurrencyProvider>
    </QueryClientProvider>
  );
};

export default GlobalProvider;
