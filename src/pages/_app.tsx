import type { AppProps } from 'next/app';
import { useState } from 'react';
import { QueryClient, QueryClientProvider, HydrationBoundary } from '@tanstack/react-query';

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    new QueryClient({
      defaultOptions: {
        // useQuery(useQueries) 훅에 대한 전역 설정
        queries: {
          retry: 0, // 쿼리 재시도 횟수를 전역적으로 설정 가능, 기본값은 3이며 기본적으로 3번의 재시도를 수행
          suspense: true, // React의 Suspense와 함께 사용할 수 있도록 설정, 즉 쿼리 상태가 loading인 경우 Suspense에 설정한 컴포넌트를 렌더링
          throwOnError: true // 쿼리 상태가 error인 경우 발생한 error를 throw 시켜주는 옵션이며, false인 경우 쿼리에서 발생한 에러가 자동으로 throw 되지 않음
        },
        // useMutation 훅에 대한 전역 설정
        mutations: {
          retry: 0, // 쿼리 재시도 횟수를 전역적으로 설정 가능, 기본값은 3이며 기본적으로 3번의 재시도를 수행
          throwOnError: true // 쿼리 상태가 error인 경우 발생한 error를 throw 시켜주는 옵션이며, false인 경우 쿼리에서 발생한 에러가 자동으로 throw 되지 않음
        }
      }
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={pageProps.dehydratedState}>
        <Component {...pageProps} />
      </HydrationBoundary>
    </QueryClientProvider>
  );
}
