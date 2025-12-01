import { EnhancedToastProvider } from '@/ui-lib/components/toast';
import { QueryProvider } from './query-provider';

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryProvider>
      <EnhancedToastProvider>{children}</EnhancedToastProvider>
    </QueryProvider>
  );
};

export default GlobalProvider;
