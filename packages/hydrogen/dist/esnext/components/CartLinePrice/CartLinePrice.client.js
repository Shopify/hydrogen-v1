import React from 'react';
import { useCartLine } from '../CartLineProvider';
import { Money } from '../Money';
/**
 * The `CartLinePrice` component renders a `Money` component for the cart line merchandise's price or
 * compare at price. It must be a descendent of a `CartLineProvider` component.
 */
export function CartLinePrice(props) {
    const cartLine = useCartLine();
    const { priceType = 'regular', ...passthroughProps } = props;
    const moneyV2 = priceType === 'regular'
        ? cartLine.cost.totalAmount
        : cartLine.cost.compareAtAmountPerQuantity;
    if (moneyV2 == null) {
        return null;
    }
    return React.createElement(Money, { ...passthroughProps, data: moneyV2 });
}
