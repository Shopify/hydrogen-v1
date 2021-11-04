import React, {ElementType, ReactNode} from 'react';
import {Metafield} from '../Metafield';
import {useProduct} from '../../hooks/useProduct/useProduct';
import {Props} from '../types';

export interface ProductMetafieldProps {
  /** A string corresponding to the [key](/api/storefront/reference/common-objects/metafield) of the product's
   * metafield.
   */
  keyName: string;
  /** A string corresponding to the [namespace](/api/storefront/reference/common-objects/metafield) of the
   * product's metafield.
   */
  namespace: string;
  /** A render function that takes a `Metafield` object as its argument. */
  children?: ReactNode;
}

/**
 * The `ProductMetafield` component renders a
 * [`Metafield`](/api/hydrogen/components/primitive/metafield) component with the product metafield.
 * It must be a descendent of a `ProductProvider` component.
 */
export function ProductMetafield<TTag extends ElementType>(
  props: Props<TTag> & ProductMetafieldProps
) {
  const product = useProduct();

  if (product == null) {
    throw new Error('Expected a ProductProvider context, but none was found');
  }

  if (product.metafields == null) {
    console.warn('No metafields available for product');
    return null;
  }

  const {namespace, keyName, ...passthroughProps} = props;

  const field = product.metafields.find(
    (metafield) =>
      metafield.namespace === namespace && metafield.key === keyName
  );

  return field ? <Metafield metafield={field} {...passthroughProps} /> : null;
}
