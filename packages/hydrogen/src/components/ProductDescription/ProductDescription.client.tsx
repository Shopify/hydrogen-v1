import React, {ElementType} from 'react';
import {Props} from '../types';
import {useProduct} from '../ProductProvider';

/**
 * The `ProductDescription` component renders a `div` with
 * the product's [`descriptionHtml`](https://shopify.dev/api/storefront/reference/products/product).
 * It must be a descendent of the `ProductProvider` component.
 */
export function ProductDescription<TTag extends ElementType = 'div'>(
  props: Props<TTag> & {
    /** An HTML tag to wrap the description. If not specified, then the
     * description is wrapped in a `div` element.
     */
    as?: TTag;
  }
) {
  const product = useProduct();

  if (product == null) {
    throw new Error('Expected a ProductProvider context, but none was found');
  }

  const Wrapper = props.as ?? 'div';

  return product.descriptionHtml ? (
    <Wrapper
      dangerouslySetInnerHTML={{__html: product.descriptionHtml}}
      {...props}
    />
  ) : null;
}
