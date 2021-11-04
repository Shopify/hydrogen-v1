import {useCart} from '../useCart';

/**
 * The `useCartLinesUpdateCallback` hook returns a callback that can be used to update lines in a cart. It must be a descendent of a `CartProvider` component.
 */
export function useCartLinesUpdateCallback() {
  const {linesUpdate} = useCart();

  return linesUpdate;
}
