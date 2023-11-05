import { useQueries, useQuery } from '@tanstack/react-query';
import { FC } from 'react';

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

  return <>Home,,,</>;
};

export default HomeContainer;
