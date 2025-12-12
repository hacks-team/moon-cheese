import { EnhancedToastProvider } from '@/ui-lib/components/toast';
import { CurrencyProvider } from './CurrencyProvider';
import { QueryProvider } from './QueryProvider';
import { ShoppingCartProvider } from './ShoppingCartProvider';

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryProvider>
      <CurrencyProvider>
        <ShoppingCartProvider>
          <EnhancedToastProvider>{children}</EnhancedToastProvider>
        </ShoppingCartProvider>
      </CurrencyProvider>
    </QueryProvider>
  );
};

export default GlobalProvider;
