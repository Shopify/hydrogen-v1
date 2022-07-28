import React from 'react';
import {useCartLine} from '../CartLineProvider/index.js';

/**
 * The `CartLineQuantity` component renders a `span` element (or the type of HTML element
 * specified by the `as` prop) with the cart line's quantity. It must be a descendent of a `CartLineProvider` component.
 */
export function CartLineQuantity<
  TTag extends keyof JSX.IntrinsicElements = 'span'
>(
  props: JSX.IntrinsicElements[TTag] & {
    /** An HTML tag to be rendered as the base element wrapper. The default is `div`. */
    as?: TTag;
  }
) {
  const cartLine = useCartLine();
  const {as, ...passthroughProps} = props;

  const Wrapper = as ? as : 'span';

  return <Wrapper {...passthroughProps}>{cartLine.quantity}</Wrapper>;
}
