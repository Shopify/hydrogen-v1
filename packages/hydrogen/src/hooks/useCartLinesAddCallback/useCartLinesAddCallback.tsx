import {useCart} from '../useCart';

/**
 * The `useCartLinesAddCallback` hook returns a callback that can be used to add lines to a cart. If a cart doesn't
 * already exist, then it will create the cart for you. It must be a descendent of a `CartProvider` component.
 */
export function useCartLinesAddCallback() {
  const {linesAdd} = useCart();

  return linesAdd;
}
