import {createContext} from 'react';
import {CollectionFragmentFragment} from './CollectionFragment';

type CollectionContextType = Omit<
  Partial<CollectionFragmentFragment>,
  'products'
> & {
  products?: CollectionFragmentFragment['products']['edges'][0]['node'][];
};

export const CollectionContext = createContext<CollectionContextType | null>(
  null
);
