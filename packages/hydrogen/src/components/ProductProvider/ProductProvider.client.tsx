import React, {ReactNode, useMemo} from 'react';
import {useProductOptions} from '../../hooks';
import {ProductContext, ProductContextType} from './context';
// import {Product} from './types';
import {Product} from '../../graphql/types/types';
import {ProductOptionsProvider} from './ProductOptionsProvider.client';

export interface ProductProviderProps {
  /** A `ReactNode` element. */
  children: ReactNode;
  /** A [Product object](/api/storefront/reference/products/product). */
  data: Partial<Product>;
  /** The initially selected variant. If this is missing, then `selectedVariantId`
   * in the returned `object` from the `useProduct` hook uses the first available variant
   * or the first variant (if none are available).
   */
  initialVariantId?: Parameters<
    typeof useProductOptions
  >['0']['initialVariantId'];
}

/**
 * The `ProductProvider` component sets up a context with product details. Descendents of
 * this component can use the `useProduct` hook.
 */
export function ProductProvider({
  children,
  data: product,
  initialVariantId,
}: ProductProviderProps) {
  const providerValue = useMemo<ProductContextType>(() => {
    return {
      ...product,
    };
  }, [product]);

  return (
    <ProductContext.Provider value={providerValue}>
      <ProductOptionsProvider initialVariantId={initialVariantId}>
        {children}
      </ProductOptionsProvider>
    </ProductContext.Provider>
  );
}
