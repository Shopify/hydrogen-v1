import React, {ReactNode, useMemo} from 'react';
import {useProductOptions, useParsedMetafields} from '../../hooks';
import {flattenConnection} from '../../utilities';
import {ProductContext, ProductContextType} from './context';
import {Product} from './types';
import {ProductProviderFragment as Fragment} from '../../graphql/graphql-constants';

export interface ProductProviderProps {
  /** A `ReactNode` element. */
  children: ReactNode;
  /** A [Product object](/api/storefront/reference/products/product). */
  data: Product;
  /** The initially selected variant. This is required only if you're using a `SelectedVariantX` hook in the `ProductProvider` component.*/
  initialVariantId?: Parameters<
    typeof useProductOptions
  >['0']['initialVariantId'];
}

/**
 * The `ProductProvider` component sets up a context with product details. Descendents of
 * this component can use the `useProduct` hook and the related `ProductX` or `SelectedVariantX` hooks.
 */
export function ProductProvider({
  children,
  data: product,
  initialVariantId,
}: ProductProviderProps) {
  const {
    variants,
    options,
    selectedVariant,
    setSelectedVariant,
    selectedOptions,
    setSelectedOption,
    setSelectedOptions,
    isOptionInStock,
    selectedSellingPlan,
    selectedSellingPlanAllocation,
    setSelectedSellingPlan,
    sellingPlanGroups,
  } = useProductOptions({
    variants: product.variants,
    initialVariantId: initialVariantId,
  });
  const metafields = useParsedMetafields(product.metafields);

  const providerValue = useMemo<ProductContextType>(() => {
    return {
      ...product,
      metafields,
      metafieldsConnection: product.metafields,
      media: product.media ? flattenConnection(product.media) : undefined,
      mediaConnection: product.media,
      variants: variants,
      variantsConnection: product.variants,
      images: product.images ? flattenConnection(product.images) : undefined,
      imagesConnection: product.images,
      collections: product.collections
        ? flattenConnection(product.collections)
        : undefined,
      collectionsConnection: product.collections,
      options,
      selectedVariant,
      setSelectedVariant,
      selectedOptions,
      setSelectedOption,
      setSelectedOptions,
      isOptionInStock,
      selectedSellingPlan,
      selectedSellingPlanAllocation,
      setSelectedSellingPlan,
      sellingPlanGroups,
    };
  }, [
    isOptionInStock,
    metafields,
    options,
    product,
    selectedOptions,
    selectedSellingPlan,
    selectedSellingPlanAllocation,
    selectedVariant,
    sellingPlanGroups,
    setSelectedOption,
    setSelectedOptions,
    setSelectedSellingPlan,
    setSelectedVariant,
    variants,
  ]);

  return (
    <ProductContext.Provider value={providerValue}>
      {children}
    </ProductContext.Provider>
  );
}

ProductProvider.Fragment = Fragment;
export const ProductProviderFragment = Fragment;
