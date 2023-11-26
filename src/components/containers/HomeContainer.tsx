import { FC } from 'react';
import {
  useInfiniteQuery,
  useMutation,
  useQueries,
  useQuery,
  useSuspenseInfiniteQuery,
  useSuspenseQueries,
  useSuspenseQuery
} from '@tanstack/react-query';

const HomeContainer: FC = () => {
  // useQuery 훅 인수로 쿼리 정보에 대한 객체를 전달
  // - queryKey 프로퍼티에 쿼리를 식별할 수 있는 key 값을 갖는 배열을 전달, 모든 쿼리에 대해서 unique한 값 작성
  // 또한 queryFn이 의존하고 있는 식별자도 같이 작성
  // - queryFn 프로퍼티에 Promise 객체를 반환하는 비동기 함수를 작성
  // 반환되는 Promise의 상태에 따라 쿼리의 status 값이 변경되며, resolve된 값이 data에 바인딩
  // - select 프로퍼티는 resolve된 값을 가공할 수 있으며, 최종적으로 반환되는 객체의 data에 바인딩

  // status 값에는 idle, loading, success, error가 존재
  // - idle: 초기 상태로 쿼리가 아직 실행되지 않았거나 실행 준비가 아직 되지 않은 상태
  // - loading: 쿼리가 현재 실행 중이며 데이터를 로드하고 있는 상태
  // - success: 쿼리 쿼리가 성공적으로 실행되었으며 데이터가 로드된 상태로, data 속성을 통해 데이터에 접근 가능
  // - 쿼리 실행 중에 오류가 발생한 상태로, error 속성을 통해 어떤 오류가 발생했는지 확인 가능
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

  const {
    data: infinityQueryData,
    status: infinityQueryDataStatus,
    fetchNextPage,
    hasNextPage
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
      // return next getNexPageParam parameters
      return {};
    }
  });

  // useInfinityQuery 훅 또한 suspense가 필요한 상황에서는 useSuspenseInfinityQuery 훅을 사용
  // 사용법은 useInfinityQuery 훅과 동일
  const {
    data: infinityQueryData2,
    status: infinityQueryData2Status,
    fetchNextPage: fetchNextPage2,
    hasNextPage: hasNextPage2
  } = useSuspenseInfiniteQuery({
    queryKey: ['suspenseInfinityQueryKey'],
    queryFn: ({ pageParam }) => {
      // return fetching data function that should be return promise object
      return () => Promise.resolve();
    },
    initialPageParam: {
      // set initial getNextPageParam parameters
    },
    getNextPageParam: (lastPage) => {
      return {
        // set next getNextPageParam parameters
      };
    }
  });

  return <>Home,,,</>;
};

export default HomeContainer;
