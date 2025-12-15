import { EnhancedToastProvider } from '@/ui-lib/components/toast';
import { CurrencyProvider } from './CurrencyProvider';
import { ShoppingCartProvider } from './ShoppingCartProvider';

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <EnhancedToastProvider>
      <CurrencyProvider>
        <ShoppingCartProvider>{children}</ShoppingCartProvider>
      </CurrencyProvider>
    </EnhancedToastProvider>
  );
};

export default GlobalProvider;
