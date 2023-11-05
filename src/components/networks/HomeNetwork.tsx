import { FC, ReactNode } from 'react';

import QueryBoundary from '@/shared/networks/QueryBoundary';

interface IProps {
  children: ReactNode;
}

const HomeNetwork: FC<IProps> = ({ children }) => {
  return <QueryBoundary>{children}</QueryBoundary>;
};

export default HomeNetwork;
