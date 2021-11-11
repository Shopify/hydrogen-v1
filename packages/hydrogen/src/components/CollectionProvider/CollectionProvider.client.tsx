import React, {ReactNode, useMemo} from 'react';
import {flattenConnection} from '../..';
import {CollectionProviderFragmentFragment} from './CollectionProviderFragment';
import {CollectionContext} from './context';
import {CollectionProviderFragment as Fragment} from '../../graphql/graphql-constants';

export function CollectionProvider({
  collection,
  children,
}: {
  collection: CollectionProviderFragmentFragment;
  children: ReactNode;
}) {
  const value = useMemo(() => {
    const products = flattenConnection(collection.products);
    return {
      ...collection,
      products,
      productCount: products.length,
      hasNextPage: collection.products.pageInfo.hasNextPage,
    };
  }, [collection]);

  return (
    <CollectionContext.Provider value={value}>
      {children}
    </CollectionContext.Provider>
  );
}

CollectionProvider.Fragment = Fragment;
export const CollectionProviderFragment = Fragment;
