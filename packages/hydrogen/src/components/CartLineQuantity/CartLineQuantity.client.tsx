import React, {ElementType} from 'react';
import {Props} from '../types';
import {useCartLine} from '../CartLineProvider';

/**
 * The `CartLineQuantity` component renders a `span` element (or the type of HTML element
 * specified by the `as` prop) with the cart line's quantity. It must be a descendent of a `CartLineProvider` component.
 */
export function CartLineQuantity<TTag extends ElementType>(props: Props<TTag>) {
  const cartLine = useCartLine();
  const {as, ...passthroughProps} = props;

  const Wrapper = as ? as : 'span';

  return <Wrapper {...passthroughProps}>{cartLine.quantity}</Wrapper>;
}
