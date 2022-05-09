import React from 'react';
import {useCartLine} from '../CartLineProvider';
import {Money} from '../Money';

interface CartLinePriceProps {
  /** The type of price. Valid values:`regular` (default) or `compareAt`. */
  priceType?: 'regular' | 'compareAt';
}

/**
 * The `CartLinePrice` component renders a `Money` component for the cart line merchandise's price or
 * compare at price. It must be a descendent of a `CartLineProvider` component.
 */
export function CartLinePrice<TTag extends keyof JSX.IntrinsicElements>(
  props: Omit<React.ComponentProps<typeof Money>, 'data'> & CartLinePriceProps
) {
  const cartLine = useCartLine();
  const {priceType = 'regular', ...passthroughProps} = props;

  const moneyV2 =
    priceType === 'regular'
      ? cartLine.estimatedCost.totalAmount
      : cartLine.merchandise.compareAtPriceV2;

  if (moneyV2 == null) {
    return null;
  }

  const price =
    priceType === 'regular'
      ? moneyV2.amount
      : parseFloat(moneyV2.amount) * cartLine.quantity;

  return (
    <Money<TTag>
      {...passthroughProps}
      data={{
        amount: `${price}`,
        currencyCode: moneyV2.currencyCode,
      }}
    />
  );
}
