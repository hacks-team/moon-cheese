import { EnhancedToastProvider } from '@/ui-lib/components/toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <EnhancedToastProvider>{children}</EnhancedToastProvider>
    </QueryClientProvider>
  );
};

export default GlobalProvider;
