import React from 'react';
import {useCartLine} from '../CartLineProvider/index.js';

/**
 * The `CartLineProductTitle` component renders a `span` element (or the type of HTML element specified by
 * the `as` prop) with the cart line merchandise's title. It must be a descendent of a `CartLineProvider` component.
 */
export function CartLineProductTitle<
  TTag extends keyof JSX.IntrinsicElements = 'span'
>(
  props: JSX.IntrinsicElements[TTag] & {
    /** An HTML tag to be rendered as the base element wrapper. The default is `span`.  */
    as?: TTag;
  }
) {
  const cartLine = useCartLine();
  const {as, ...passthroughProps} = props;

  const Wrapper = as ? as : 'span';

  return (
    <Wrapper {...passthroughProps}>
      {cartLine.merchandise.product.title}
    </Wrapper>
  );
}
