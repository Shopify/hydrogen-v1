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
  /** The initially selected variant.
   * The following logic applies to `initialVariantId`:
   * If `initialVariantId` is provided, then it's used, even if it's out of stock.
   * If `initialVariantId` is provided, but is `null`, then no variant is used.
   * If nothing is passed to `initialVariantId`, and you're in a `ProductProvider`, then `selectedVariant.id` is used.
   * If nothing is passed to `initialVariantId` and you're not in a `ProductProvider`, then the first available or in-stock variant is used.
   * If nothing is passed to `initialVariantId`, you're not in a `ProductProvider`, and no variants are in stock, then the first variant is used.
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
