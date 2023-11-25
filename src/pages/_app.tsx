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
          throwOnError: false, // 쿼리 상태가 error인 경우 발생한 error를 throw 시켜주는 옵션이며, false인 경우 쿼리에서 발생한 에러가 자동으로 throw 되지 않음
          enabled: true, // 쿼리가 자동으로 실행되며, false로 설정한 경우 수동으로 쿼리를 실행, 기본값은 true
          gcTime: 5 * 60 * 1000, // 기존 cacheTime 옵션과 동일, inactive 및 unused 쿼리 데이터를 메모리에 유지시키는 시간, 기본값은 5분
          staleTime: 0 // 쿼리 데이터가 fresh에서 stale로 전환되는 시간, 기본값은 0
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
