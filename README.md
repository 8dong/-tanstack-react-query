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
  // 각 페이지별로 queryClient를 독립적으로 생성하여 사용
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
          throwOnError: true // 쿼리 상태가 error인 경우 발생한 error를 throw 시켜주는 옵션이며, false인 경우 쿼리에서 발생한 에러가 자동으로 throw 되지 않음
          retry: 0, // 쿼리 재시도 횟수를 전역적으로 설정 가능, 기본값은 3이며 기본적으로 3번의 재시도를 수행
          throwOnError: false, // 쿼리 상태가 error인 경우 발생한 error를 throw 시켜주는 옵션, false인 경우 쿼리에서 발생한 에러가 자동으로 throw 되지 않음
          enabled: true, // 쿼리가 자동으로 실행, false로 설정한 경우 수동으로 쿼리를 실행, 기본값은 true
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
    // children에서 useSuspenseQuery, useSuspenseQueries, useSuspenseInfiniteQuery 사용하는 경우, 쿼리 상태가 loading이라면 Suspense의 fallback 컴포넌트를 렌더링
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

## useQuery & useQuries

```js
// src/components/containers/HomeContainer.tsx

import { FC } from 'react';
import { useQueries, useQuery } from '@tanstack/react-query';

const HomeContainer: FC = () => {
  // useQuery 훅 인수로 쿼리 정보에 대한 객체를 전달
  //  - queryKey 프로퍼티에 쿼리를 식별할 수 있는 key 값을 갖는 배열을 전달, 모든 쿼리에 대해서 unique한 값 작성
  //    또한 queryFn이 의존하고 있는 식별자도 같이 작성, 참고로 queryKey의 Unique는 배열의 값 뿐만 아니라 순서도 영향
  //    ex) ['querykey']와 ['querykey', 1]은 서로 다른 쿼리로 식별, [1, 'queryKey']와 ['queryKey', 1]도 서로 다른 쿼리로 식별
  //  - queryFn 프로퍼티에 Promise 객체를 반환하는 비동기 함수를 작성
  //    반환되는 Promise의 상태에 따라 쿼리의 status 값이 변경되며, resolve된 값이 data에 바인딩
  //  - select 프로퍼티는 resolve된 값을 가공할 수 있으며, 최종적으로 반환되는 객체의 data에 바인딩

  // status 값에는 idle, loading, success, error가 존재
  //  - idle: 초기 상태로 쿼리가 아직 실행되지 않았거나 실행 준비가 아직 되지 않은 상태
  //  - loading: 쿼리가 현재 실행 중이며 데이터를 로드하고 있는 상태
  //  - success: 쿼리 쿼리가 성공적으로 실행되었으며 데이터가 로드된 상태로, data 속성을 통해 데이터에 접근 가능
  //  - 쿼리 실행 중에 오류가 발생한 상태로, error 속성을 통해 어떤 오류가 발생했는지 확인 가능
  const { data, status, error } = useQuery({
    queryKey: ['queryKey'],
    queryFn: () => {
      // Fetching Data,,,

      // return Promise Object
      return Promise.resolve(1);
    },
    select: (data) => {
      // Transform Fetching Data,,,

      return data;
    }
  });

  // useQuries 훅은 여러 개의 쿼리를 동시에 실행하고 결과를 반환하는 데 사용
  const [{ data: secondFetchingData }, { data: thridFetchingData }] = useQueries({
    queries: [
      {
        queryKey: ['queryKey2'],
        queryFn: () => Promise.resolve(2)
      },
      {
        queryKey: ['queryKey3'],
        queryFn: () => Promise.resolve(3)
      }
    ]
  });

  return <>Home,,,</>;
};

export default HomeContainer;
```

### useSuspenseQuery & useSuspenseQueries

```js
// src/components/containers/HomeContainer.tsx

import { FC } from 'react';
import { useSuspenseQueries, useSuspenseQuery } from '@tanstack/react-query';

const HomeContainer: FC = () => {
  // 기존(v4) queryClient의 suspense 옵션은 제거되고 필요에 따라 useSuspenseQuery 훅을 사용
  // suspense hook의 에러를 ErrorBoundary와 Suspense가 관리하므로 status 값이 언제나 success
  // useQuery 훅과 사용법, 반환값은 동일
  const { data: suspenseData, status: suspenseQueryDataStatus } = useSuspenseQuery({
    queryKey: ['suspenseQuerykey1'],
    queryFn: () => Promise.resolve(1)
  });

  // useQueries 훅과 동일하게 suspense가 필요한 상황에 useSuspenseQueries 훅을 필요에 따라 사용
  // useQueries 훅과 사용법, 반환값은 동일
  const [{ data: suspenseData2, status: suspenseQueryData2Status }] = useSuspenseQueries({
    queries: [
      {
        queryKey: ['suspenseQueryKey2'],
        queryFn: () => Promise.resolve()
      }
    ]
  });

  return <>Home,,,</>;
};

export default HomeContainer;
```

## useMutate

```js
// src/components/containers/HomeContainer.tsx

import { FC } from 'react';
import { useMutation } from '@tanstack/react-query';

const HomeContainer: FC = () => {
  const { mutate, mutateAsync } = useMutation({
    // useMutation 훅은 서버 데이터를 수정(POST, PUT, DELETE, PATCH)할 때 사용되는 훅
    // 인수로 쿼리에 대한 정보를 갖는 객체를 전달
    // - mutationFn 프로퍼티에는 함수를 전달하며, 해당 함수는 서버 데이터를 수정하는 비동기 함수를 반환값으로 작성
    //   반환값으로 작성한 비동기 함수는 Promise 객체를 반환하는 함수 작성
    //   mutationFn은 인수로 객체를 전달받으며, 이는 useMutation 훅이 반환하는 객체의 mutate(mutateAsync) 호출시 전달되는 인수를 그대로 전달

    // useMutation 훇은 객체를 반환하며, 반환되는 객체의 mutate 호출 시 mutateFn을 실행
    // mutateAsync의 경우 mutate와 달리 Promise를 반환 이외 mutate와 동일
    mutationFn: (variables: Object) => {
      // Return Modifying Server Data Function
      return Promise.resolve();
    },
    // mutateFn가 반환값에 작성한 비동기 함수의 상태가 fullfilled된 직후 실행될 함수
    onSuccess: () => {
      // Success mutateFn
    },

    // mutateFn가 반환값에 작성한 비동기 함수의 상태가 rejected된 직후 실행될 함수
    onError: () => {
      // Fail mutateFn
    },

    // mutateFn가 반환값에 작성한 비동기 함수의 상태가 settled된 직후 실행될 함수
    onSettled: () => {
      // settled mutateFn
    }
  });

  return <>Home,,,</>;
};

export default HomeContainer;
```

## useInfinityQuery

```js
import { FC } from 'react';
import {
  useInfiniteQuery,
  useMutation,
  useQueries,
  useQuery,
  useSuspenseQueries,
  useSuspenseQuery
} from '@tanstack/react-query';

const HomeContainer: FC = () => {
  const {
    data: infinityQueryData,
    status: infinityQueryDataStatus,
    fetchNextPage, // fetchNextPage 호출시 getNextPageParam가 호출되며 최종적으로 queryFn까지 자동적으로 호출
    hasNextPage // getNextPageParam의 반환값이 undefined인 경우 false, 값이 존재하는 경우 true
  } = useInfiniteQuery({
    queryKey: ['infinityQueryKey'],
    queryFn: ({ pageParam }) => {
      // useInfinityQuery 훅이 반환한 객체의 fetchNextPage 메서드 반환값이 getNextPageParam 메서드로 전달되고, getNextPageParam 메서드 반환값이 queryFn의 인수로 전달되면서 실행
      // flow: fetchNextPage -> getNextPageParam -> queryFn
      // queryFn은 인수로 객체를 전달받으며, 전달받는 객체의 pageParam 프로퍼티에는 getNextPage 메서드 반환값이 전달
      // 반환값으로 Promise 객체를 반환하는 비동기 함수를 작성
      return () => Promise.resolve();
    },
    initialPageParam: {
      // set initial getNextPageParam parameters
      // 초기 queryFn 인수로 전달될 객체의 pageParam 프로퍼티 값을 작성
    },
    getNextPageParam: (lastPage) => {
      // 인수로 이전 쿼리 데이터를 전달받으며, useInfinityQuery 훅이 반환한 객체의 fetchNextPage 메서드 호출시 실행
      // 만약 return 값이 undefined라면 fetchNextPage 메서드를 실행하지 않으며, hasNextPage 프로퍼티 값을 false로 갱신
      // return next getNexPageParam parameters
      return {};
    }
  });

  return <>Home,,,</>;
};

export default HomeContainer;
```
