import React from 'react';
import {useCartLine} from '../CartLineProvider/index.js';
import {Money} from '../Money/index.js';

interface CartLinePriceProps {
  /** The type of price. Valid values:`regular` (default) or `compareAt`. */
  priceType?: 'regular' | 'compareAt';
}

/**
 * The `CartLinePrice` component renders a `Money` component for the cart line merchandise's price or
 * compare at price. It must be a descendent of a `CartLineProvider` component.
 */
export function CartLinePrice(
  props: Omit<React.ComponentProps<typeof Money>, 'data'> & CartLinePriceProps
) {
  const cartLine = useCartLine();
  const {priceType = 'regular', ...passthroughProps} = props;

  const moneyV2 =
    priceType === 'regular'
      ? cartLine.cost.totalAmount
      : cartLine.cost.compareAtAmountPerQuantity;

  if (moneyV2 == null) {
    return null;
  }

  return <Money {...passthroughProps} data={moneyV2} />;
}
