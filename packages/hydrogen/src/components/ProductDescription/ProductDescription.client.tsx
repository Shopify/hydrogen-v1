import React from 'react';
import {RawHtml} from '../RawHtml';
import {useProduct} from '../ProductProvider';

/**
 * The `ProductDescription` component renders a `RawHtml` component with
 * the product's [`descriptionHtml`](/api/storefront/reference/products/product).
 * It must be a descendent of the `ProductProvider` component.
 */
export function ProductDescription(
  props: Omit<React.ComponentProps<typeof RawHtml>, 'string'>
) {
  const product = useProduct();

  if (product == null) {
    throw new Error('Expected a ProductProvider context, but none was found');
  }

  return product.descriptionHtml ? (
    <RawHtml
      dangerouslySetInnerHTMLString={product.descriptionHtml}
      {...props}
    />
  ) : null;
}
