import React, {ReactNode, ElementType} from 'react';
import {useCart} from '../CartProvider';
import {Props} from '../types';
import {useCartLine} from '../CartLineProvider';

type PropsWeControl = 'onClick' | 'adjust';

/**
 * The `CartLineQuantityAdjustButton` component renders a button that adjusts the cart line's quantity when pressed.
 * It must be a descendent of a `CartLineProvider` component.
 */
export function CartLineQuantityAdjustButton<
  TTag extends ElementType = 'button'
>(
  props: Props<TTag, PropsWeControl> & {
    /** Any `ReactNode` elements. */
    children: ReactNode;
    /** The adjustment for a cart line's quantity. Valid values: `increase` (default), `decrease`, or `remove`. */
    adjust?: 'increase' | 'decrease' | 'remove';
  }
) {
  const {status, linesRemove, linesUpdate} = useCart();
  const cartLine = useCartLine();
  const {children, adjust, ...passthroughProps} = props;

  return (
    <button
      disabled={status !== 'idle'}
      onClick={() => {
        if (adjust === 'remove') {
          linesRemove([cartLine.id]);
          return;
        }

        const quantity =
          adjust === 'decrease' ? cartLine.quantity - 1 : cartLine.quantity + 1;

        if (quantity <= 0) {
          linesRemove([cartLine.id]);
          return;
        }

        linesUpdate([{id: cartLine.id, quantity}]);
      }}
      {...passthroughProps}
    >
      {children}
    </button>
  );
}
