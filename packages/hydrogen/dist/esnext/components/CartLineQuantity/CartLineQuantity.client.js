import React from 'react';
import { useCartLine } from '../CartLineProvider';
/**
 * The `CartLineQuantity` component renders a `span` element (or the type of HTML element
 * specified by the `as` prop) with the cart line's quantity. It must be a descendent of a `CartLineProvider` component.
 */
export function CartLineQuantity(props) {
    const cartLine = useCartLine();
    const { as, ...passthroughProps } = props;
    const Wrapper = as ? as : 'span';
    return React.createElement(Wrapper, { ...passthroughProps }, cartLine.quantity);
}
