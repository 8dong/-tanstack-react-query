import { QueryClient, dehydrate } from '@tanstack/react-query';

export default function Home() {
  return <>Home</>;
}

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
