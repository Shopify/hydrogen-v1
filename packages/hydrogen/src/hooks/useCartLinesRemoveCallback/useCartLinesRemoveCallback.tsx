import {useCart} from '../useCart';

/**
 * The `useCartLinesRemoveCallback` hook returns a callback that can be used to remove lines from a cart. It must be a descendent of a `CartProvider` component.
 */
export function useCartLinesRemoveCallback() {
  const {linesRemove} = useCart();

  return linesRemove;
}
