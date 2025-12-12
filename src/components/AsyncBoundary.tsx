import { ErrorBoundary } from '@suspensive/react';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense, type ReactNode } from 'react';

/**
 * 비동기 데이터 패칭 컴포넌트의 로딩/에러 상태를 선언적으로 처리하는 래퍼
 *
 * 에러 폴백의 재실행 함수에는 리액트 쿼리 리패치 로직도 포함
 *
 * QueryErrorResetBoundary + ErrorBoundary + Suspense로 구성
 */
const AsyncBoundary = ({
  children,
  errorFallback,
  suspenseFallback,
}: {
  children: ReactNode;
  errorFallback: ({ onRetry }: { onRetry: () => void }) => ReactNode;
  suspenseFallback: ReactNode;
}) => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} fallback={({ reset }) => errorFallback({ onRetry: reset })}>
          <Suspense fallback={suspenseFallback}>{children}</Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};

export default AsyncBoundary;
