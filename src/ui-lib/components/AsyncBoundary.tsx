import ErrorSection from '@/components/ErrorSection';

interface Props {
  isLoading: boolean;
  isError: boolean;
  onRetry?: () => void;
  loadingFallback: React.ReactNode;
  errorFallback?: React.ReactNode;
  children: React.ReactNode;
}

export function AsyncBoundary({ isLoading, isError, onRetry, loadingFallback, errorFallback, children }: Props) {
  if (isLoading) {
    return loadingFallback;
  }

  if (isError) {
    return errorFallback ?? <ErrorSection onRetry={onRetry} />;
  }

  return children;
}
