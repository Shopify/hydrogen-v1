import React, {ElementType} from 'react';
import {RawHtml} from '../RawHtml';
import {useProduct} from '../ProductProvider';
import {Props} from '../types';

/**
 * The `ProductDescription` component renders a `RawHtml` component with
 * the product's [`descriptionHtml`](/api/storefront/reference/products/product).
 * It must be a descendent of the `ProductProvider` component.
 */
export function ProductDescription<TTag extends ElementType = 'div'>(
  props: Props<TTag>
) {
  const product = useProduct();

  if (product == null) {
    throw new Error('Expected a ProductProvider context, but none was found');
  }

  return product.descriptionHtml ? (
    <RawHtml string={product.descriptionHtml} {...props} />
  ) : null;
}
