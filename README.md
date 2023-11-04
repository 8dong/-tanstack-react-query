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
