import { EnhancedToastProvider } from '@/ui-lib/components/toast';
import { CartProvider } from './cart-provider';
import { CurrencyProvider } from './currency-provider';
import { QueryProvider } from './query-provider';

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryProvider>
      <CartProvider>
        <CurrencyProvider>
          <EnhancedToastProvider>{children}</EnhancedToastProvider>
        </CurrencyProvider>
      </CartProvider>
    </QueryProvider>
  );
};

export default GlobalProvider;
