import React, { FC, Suspense, ReactElement, ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface IProps {
  loadingFallback?: ReactElement;
  errorFallback?: ReactElement;
  children: ReactNode;
}

const QueryBoundary: FC<IProps> = ({
  loadingFallback = <>Loading,,,</>,
  errorFallback = <>Error,,,</>,
  children
}) => {
  return (
    // suspense option이 true인 경우, 쿼리 상태가 loading이라면 Suspense의 fallback 컴포넌트를 렌더링
    // children에서 useSuspenseQuery, useSuspenseQueries, useSuspenseInfiniteQuery 훅 사용하는 경우 Suspense의 fallback prop으로 전달한 컴포넌트가 렌더링
    // throwOnError option이 true인 경우, 쿼리 상태가 error라면 ErrorBoundary의 fallback 컴포넌트 렌더링
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={loadingFallback}>{children}</Suspense>;
    </ErrorBoundary>
  );
};

export default QueryBoundary;
