import React, {useCallback} from 'react';
import {useCart} from '../CartProvider/index.js';
import {useCartLine} from '../CartLineProvider/index.js';
import {BaseButton, BaseButtonProps} from '../BaseButton/index.js';
import type {CartLineUpdateInput} from '../../storefront-api-types.js';

interface CartLineQuantityAdjustButtonBaseProps {
  /** The adjustment for a cart line's quantity. Valid values: `increase` (default), `decrease`, or `remove`. */
  adjust?: 'increase' | 'decrease' | 'remove';
}

type CartLineQuantityAdjustButtonProps<
  AsType extends React.ElementType = 'button'
> = BaseButtonProps<AsType> & CartLineQuantityAdjustButtonBaseProps;

/**
 * The `CartLineQuantityAdjustButton` component renders a button that adjusts the cart line's quantity when pressed.
 * It must be a descendent of a `CartLineProvider` component.
 */
export function CartLineQuantityAdjustButton<
  AsType extends React.ElementType = 'button'
>(props: CartLineQuantityAdjustButtonProps<AsType>): JSX.Element {
  const {status, linesRemove, linesUpdate} = useCart();
  const cartLine = useCartLine();
  const {children, adjust, onClick, ...passthroughProps} = props;

  const handleAdjust = useCallback(() => {
    if (adjust === 'remove') {
      linesRemove([cartLine?.id ?? '']);
      return;
    }

    const quantity =
      adjust === 'decrease'
        ? (cartLine?.quantity ?? 0) - 1
        : (cartLine?.quantity ?? 0) + 1;

    if (quantity <= 0) {
      linesRemove([cartLine?.id ?? '']);
      return;
    }

    const lineUpdate: CartLineUpdateInput = {
      id: cartLine?.id ?? '',
      quantity,
      attributes: (cartLine?.attributes ??
        []) as CartLineUpdateInput['attributes'],
    };

    linesUpdate([lineUpdate]);
  }, [
    adjust,
    cartLine?.attributes,
    cartLine?.id,
    cartLine?.quantity,
    linesRemove,
    linesUpdate,
  ]);

  return (
    <BaseButton
      onClick={onClick}
      defaultOnClick={handleAdjust}
      {...(passthroughProps as any)}
      disabled={
        typeof passthroughProps.disabled !== 'undefined'
          ? passthroughProps.disabled
          : status !== 'idle'
      }
    >
      {children}
    </BaseButton>
  );
}
