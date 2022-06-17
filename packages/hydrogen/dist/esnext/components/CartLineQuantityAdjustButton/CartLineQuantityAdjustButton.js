import React, { useCallback } from 'react';
import { useCart } from '../CartProvider';
import { useCartLine } from '../CartLineProvider';
import { BaseButton } from '../BaseButton';
/**
 * The `CartLineQuantityAdjustButton` component renders a button that adjusts the cart line's quantity when pressed.
 * It must be a descendent of a `CartLineProvider` component.
 */
export function CartLineQuantityAdjustButton(props) {
    const { status, linesRemove, linesUpdate } = useCart();
    const cartLine = useCartLine();
    const { children, adjust, onClick, ...passthroughProps } = props;
    const handleAdjust = useCallback(() => {
        if (adjust === 'remove') {
            linesRemove([cartLine.id]);
            return;
        }
        const quantity = adjust === 'decrease' ? cartLine.quantity - 1 : cartLine.quantity + 1;
        if (quantity <= 0) {
            linesRemove([cartLine.id]);
            return;
        }
        linesUpdate([{ id: cartLine.id, quantity }]);
    }, [adjust, cartLine.id, cartLine.quantity, linesRemove, linesUpdate]);
    return (React.createElement(BaseButton, { disabled: status !== 'idle', onClick: onClick, defaultOnClick: handleAdjust, ...passthroughProps }, children));
}
