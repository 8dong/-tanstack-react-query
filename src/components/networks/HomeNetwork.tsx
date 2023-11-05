import { FC, ReactNode } from 'react';

import QueryBoundary from '@/shared/networks/QueryBoundary';
import HomeContainer from '../containers/HomeContainer';

interface IProps {
  children: ReactNode;
}

const HomeNetwork: FC<IProps> = ({ children }) => {
  return (
    <QueryBoundary>
      <HomeContainer />
    </QueryBoundary>
  );
};

export default HomeNetwork;
