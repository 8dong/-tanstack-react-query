# @tanstack/react-query v5 with Next.js

## queryClient & Hydrate

```js
// src/pages/_app.tsx

import type { AppProps } from 'next/app';
import { useState } from 'react';
import { QueryClient, QueryClientProvider, HydrationBoundary } from '@tanstack/react-query';

export default function App({ Component, pageProps }: AppProps) {
  // queryClient는 _app.tsx 파일 내 컴포넌트에 생성하고 이를 state로 관리
  // state로 관리한다면 서버와 클라인트간 queryClient 일치 보장
  const [queryClient] = useState(new QueryClient());

  return (
    // 생성된 queryClient를 하위 컴포넌트가 접근하기 위해 QueryClientProvider 컴포넌트의 client prop으로 생성한 queryClient 전달
    // HydrationBoundary 컴포넌트는 페이지 컴포넌트가 pageProps.dehydratedState로 queryClient를 전달한 경우 우선적으로 사용
    // 즉, pageProps.dehydratedState가 우선되며 전달받지 못한 경우 QueryClientProvider의 client prop으로 전달된 queryClient 사용
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={pageProps.dehydratedState}>
        <Component {...pageProps} />
      </HydrationBoundary>
    </QueryClientProvider>
  );
}
```

```js
// src/pages/index.tsx

import { QueryClient, dehydrate } from '@tanstack/react-query';

export default function Home() {
  return <>,,,</>;
}

// getServerSideProps 함수 내부에서 queryClient를 생성하고 이를 dehydrate 함수 인수로 전달한 값을 dehydratedState로 전달 가능
// dehydratedState로 전달한 QueryClient는 _app.tsx 파일 내 컴포넌트에게 전달
// 즉, SSR 시점에서 pre-fetching과 같은 기능을 사용 가능
export const getServerSideProps = () => {
  const queryClient = new QueryClient();

  // Can pre-fetching server data (SSR)
  // queryClient.prefetchQuery({
  //   queryKey: ['queryKey'],
  //   queryFn: () => { }
  // })

  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  };
};
```

### QueryClient Default Options (with Suspense, ErrorBoundary)

```js
// src/pages/_app.tsx
import type { AppProps } from 'next/app';
import { useState } from 'react';
import { QueryClient, QueryClientProvider, HydrationBoundary } from '@tanstack/react-query';

export default function App({ Component, pageProps }: AppProps) {
  // QueryClient를 new 연산자와 함께 호출할 때 전역적으로 쿼리에 대한 설정을 Set 가능
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
```

```js
// src/components/shared/networks/QueryBoundary.tsx
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
    // throwOnError option이 true인 경우, 쿼리 상태가 error라면 ErrorBoundary의 fallback 컴포넌트 렌더링

    // Suspense는 하위에서 Lazy Loading, Data Fetching등 pending 상태에 대한 UI를 선언
    // ErrorBoundary는 하위에서 try...catch문에서 catch와 같은 역할을 하며, throw된 error가 catch되지 않은 경우 렌더링될 UI를 선언
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={loadingFallback}>{children}</Suspense>;
    </ErrorBoundary>
  );
};

export default QueryBoundary;
```
