import React, {ElementType} from 'react';
import {useCartLine} from '../CartLineProvider';
import {Money, MoneyProps} from '../Money';
import {Props} from '../types';

export interface CartLinePriceProps extends Omit<MoneyProps, 'money'> {
  /** The type of price. Valid values:`regular` (default) or `compareAt`. */
  priceType?: 'regular' | 'compareAt';
}

/**
 * The `CartLinePrice` component renders a `Money` component for the cart line merchandise's price or
 * compare at price. It must be a descendent of a `CartLineProvider` component.
 */
export function CartLinePrice<TTag extends ElementType>(
  props: Props<TTag> & CartLinePriceProps
) {
  const cartLine = useCartLine();
  const {priceType = 'regular', ...passthroughProps} = props;

  const price =
    priceType === 'regular'
      ? cartLine.merchandise.priceV2
      : cartLine.merchandise.compareAtPriceV2;

  if (price == null) {
    return null;
  }

  return (
    <Money
      {...passthroughProps}
      money={{
        amount: price.amount * cartLine.quantity,
        currencyCode: price.currencyCode,
      }}
    />
  );
}
