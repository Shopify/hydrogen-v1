import React, {ElementType} from 'react';
import {useProduct} from '../ProductProvider';
import {Props} from '../types';

/**
 * The `ProductTitle` component renders a `span` element (or the type of
 * HTML element specified by the `as` prop) with the product's [`title`](/api/storefront/reference/products/product).
 * It must be a descendent of the `ProductProvider` component.
 */
export function ProductTitle<TTag extends ElementType = 'span'>(
  props: Props<TTag> & {
    /** The `as` prop is an HTML element to wrap the title. If not specified, then the
     * title is wrapped in a `span` element.
     */
    as?: ElementType;
  }
) {
  const product = useProduct();

  if (product == null) {
    throw new Error('Expected a ProductProvider context, but none was found');
  }

  const {as, ...passthroughProps} = props;

  const Wrapper = as ? as : 'span';

  return product.title ? (
    <Wrapper {...passthroughProps}>{product.title}</Wrapper>
  ) : null;
}
