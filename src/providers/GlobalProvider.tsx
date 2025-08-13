import { EnhancedToastProvider } from '@/ui-lib/components/toast';

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  return <EnhancedToastProvider>{children}</EnhancedToastProvider>;
};

export default GlobalProvider;
