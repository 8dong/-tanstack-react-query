import { QueryClient, dehydrate } from '@tanstack/react-query';

import HomeNetwork from '@/components/networks/HomeNetwork';

export default function Home() {
  return (
    <HomeNetwork>
      <>Home,,,</>
    </HomeNetwork>
  );
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
