import React, {ReactNode, useMemo} from 'react';
import {useProductOptions, useParsedMetafields} from '../../hooks';
import {flattenConnection} from '../../utilities';
import {ProductContext, ProductContextType} from './context';
import {ProductOptionsProvider} from './ProductOptionsProvider.client';
import type {Product as ProductType} from '../../storefront-api-types';
import type {PartialDeep} from 'type-fest';

export interface ProductProviderProps {
  /** A `ReactNode` element. */
  children: ReactNode;
  /** A [Product object](https://shopify.dev/api/storefront/reference/products/product). */
  data: PartialDeep<ProductType>;
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
  const metafields = useParsedMetafields(product.metafields || {});

  // @ts-expect-error The types here are broken on main, need to come back and fix them sometime
  const providerValue = useMemo<ProductContextType>(() => {
    return {
      ...product,
      metafields,
      metafieldsConnection: product.metafields,
      media: product.media ? flattenConnection(product.media) : undefined,
      mediaConnection: product.media,
      variants: product.variants
        ? flattenConnection(product.variants)
        : undefined,
      variantsConnection: product.variants,
      images: product.images ? flattenConnection(product.images) : undefined,
      imagesConnection: product.images,
      collections: product.collections
        ? flattenConnection(product.collections)
        : undefined,
      collectionsConnection: product.collections,
    };
  }, [metafields, product]);

  return (
    <ProductContext.Provider value={providerValue}>
      <ProductOptionsProvider initialVariantId={initialVariantId}>
        {children}
      </ProductOptionsProvider>
    </ProductContext.Provider>
  );
}
