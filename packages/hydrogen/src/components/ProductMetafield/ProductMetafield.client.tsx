import React, {ElementType} from 'react';
import {Metafield} from '../Metafield';
import {useProduct} from '../../hooks/useProduct/useProduct';
import {Props} from '../types';
import {MetafieldProps} from '../Metafield/Metafield.client';
import {flattenConnection} from '../../utilities';

export interface ProductMetafieldProps
  extends Omit<MetafieldProps, 'metafield'> {
  /** A string corresponding to the [key](/api/storefront/reference/common-objects/metafield) of the product's
   * metafield.
   */
  keyName: string;
  /** A string corresponding to the [namespace](/api/storefront/reference/common-objects/metafield) of the
   * product's metafield.
   */
  namespace: string;
  /** If provided, use this variant's metafield corresponding to this Id instead of the product's metafield. */
  variantId?: string;
}

/**
 * The `ProductMetafield` component renders a
 * [`Metafield`](/api/hydrogen/components/primitive/metafield) component with the product metafield.
 * It must be a descendent of a `ProductProvider` component.
 */
export function ProductMetafield<TTag extends ElementType>(
  props: Props<TTag> & Omit<ProductMetafieldProps, 'data'>
) {
  const product = useProduct();

  if (product == null) {
    throw new Error('Expected a ProductProvider context, but none was found');
  }

  if (product.metafields == null) {
    console.warn('No metafields available for product');
    return null;
  }

  const {namespace, keyName, variantId, ...passthroughProps} = props;

  const metafields = variantId
    ? flattenConnection(
        product.variants?.find(({id}) => id === variantId)?.metafields ?? {}
      )
    : product.metafields;

  const field = metafields?.find(
    (metafield) =>
      metafield.namespace === namespace && metafield.key === keyName
  );

  if (field === null || field === undefined) {
    const message = 'does not have a value for metafield.';
    const productOrVariant = variantId ? `Variant` : 'Product';

    const logItems = {
      variantId: variantId,
      ProductId: product.id,
      namespace,
      keyName,
    };

    console.warn(
      [
        productOrVariant,
        message,
        ...Object.entries(logItems).map(([key, val]) => `${key}: ${val}`),
      ].join(' ')
    );

    return null;
  }

  return <Metafield data={field} {...passthroughProps} />;
}
