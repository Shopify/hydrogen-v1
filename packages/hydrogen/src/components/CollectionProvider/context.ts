import {createContext} from 'react';
import {CollectionProviderFragmentFragment} from './CollectionProviderFragment';

type CollectionContextType = Omit<
  Partial<CollectionProviderFragmentFragment>,
  'products'
> & {
  products?: CollectionProviderFragmentFragment['products']['edges'][0]['node'][];
  hasNextPage?: boolean;
};

export const CollectionContext = createContext<CollectionContextType | null>(
  null
);
