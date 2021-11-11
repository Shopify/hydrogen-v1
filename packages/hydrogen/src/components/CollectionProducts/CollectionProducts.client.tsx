import React, {ReactNode} from 'react';
import {useCollection} from '../../hooks';
import {ProductProvider} from '../ProductProvider';

export function CollectionProducts({children}: {children: ReactNode}) {
  const collection = useCollection();

  if (collection == null) {
    throw new Error('Expected a ProductProvider context, but none was found');
  }

  if (collection.products == null) {
    return null;
  }

  return (
    <>
      {collection.products.map((product) => {
        const initialVariant = product.variants.edges[0].node;
        return (
          <ProductProvider
            key={product.id}
            product={product}
            initialVariantId={initialVariant.id}
          >
            {children}
          </ProductProvider>
        );
      })}
    </>
  );
}
