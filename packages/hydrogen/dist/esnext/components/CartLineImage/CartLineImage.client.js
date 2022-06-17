import React from 'react';
import { useCartLine } from '../CartLineProvider';
import { Image } from '../Image';
/**
 * The `CartLineImage` component renders an `Image` component for the cart line merchandise's image.
 * It must be a descendent of a `CartLineProvider` component.
 */
export function CartLineImage(props) {
    const cartLine = useCartLine();
    return cartLine.merchandise.image ? (React.createElement(Image, { ...props, data: cartLine.merchandise.image })) : null;
}
