import React, {ReactNode, useMemo} from 'react';
import {flattenConnection} from '../..';
import {CollectionFragmentFragment} from './CollectionFragment';
import {CollectionContext} from './context';

export function CollectionProvider({
  collection,
  children,
}: {
  collection: CollectionFragmentFragment;
  children: ReactNode;
}) {
  const value = useMemo(() => {
    return {
      ...collection,
      products: flattenConnection(collection.products),
    };
  }, [collection]);

  return (
    <CollectionContext.Provider value={value}>
      {children}
    </CollectionContext.Provider>
  );
}
