import React from 'react';
import {useCart} from '../useCart';

/**
 * The `useCartLinesTotalQuantity` hook returns the total amount of items in the cart. It must be a descendent of a `CartProvider` component.
 */
export function useCartLinesTotalQuantity() {
  const {lines} = useCart();

  const itemCount =
    React.useMemo(() => {
      return lines.reduce((accumulator, line) => {
        return accumulator + line.quantity;
      }, 0);
    }, [lines]) ?? 0;

  return itemCount;
}
