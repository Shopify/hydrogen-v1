import React from 'react';
import {ProductOptionsContext} from './context';
import {useProductOptions} from '../../hooks';
import {useProduct} from '../../hooks/useProduct';
import type {ProductProviderProps} from './ProductProvider.client';

interface ProductOptionsProviderProps {
  children: React.ReactNode;
  initialVariantId: ProductProviderProps['initialVariantId'];
}

export function ProductOptionsProvider({
  children,
  initialVariantId,
}: ProductOptionsProviderProps) {
  const product = useProduct();
  const productOptions = useProductOptions({
    variants: product.variantsConnection,
    initialVariantId,
  });

  return (
    <ProductOptionsContext.Provider value={productOptions}>
      {children}
    </ProductOptionsContext.Provider>
  );
}
