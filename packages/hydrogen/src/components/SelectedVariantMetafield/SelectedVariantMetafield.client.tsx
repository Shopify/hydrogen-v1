import React, {ElementType, ReactNode} from 'react';
import {Props} from '../types';
import {useProduct} from '../../hooks/useProduct/useProduct';
import {Metafield} from '../Metafield';

export interface SelectedVariantMetafieldProps {
  /** A string corresponding to the [key](/api/storefront/reference/common-objects/metafield) of the selected variant's metafield. */
  keyName: string;
  /** A string corresponding to the [namespace](/api/storefront/reference/common-objects/metafield) of the selected variant's metafield. */
  namespace: string;
  /** A render function that takes a `Metafield` object as its argument. */
  children?: ReactNode;
}

/**
 * The `SelectedVariantMetafield` component renders a [`Metafield`](/api/hydrogen/components/primitive/metafield)
 * component with the selected product's metafield.
 * It must be a descendent of a `ProductProvider` component.
 */
export function SelectedVariantMetafield<TTag extends ElementType>(
  props: Props<TTag> & SelectedVariantMetafieldProps
) {
  const product = useProduct();

  if (product == null) {
    throw new Error('Expected a Product context, but none was found');
  }

  const {keyName, namespace, ...passthroughProps} = props;

  const metafield = product.selectedVariant?.metafields?.edges?.find(
    ({node}) => {
      return node.namespace === namespace && node.key === keyName;
    }
  )?.node;

  return metafield ? (
    <Metafield metafield={metafield} {...passthroughProps} />
  ) : null;
}
