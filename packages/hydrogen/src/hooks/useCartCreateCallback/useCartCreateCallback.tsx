import {useCart} from '../useCart';

/**
 * The `useCartCreateCallback` hook returns a callback that can be used to create a cart. It must be a descendent of a `CartProvider` component.
 */
export function useCartCreateCallback() {
  const {cartCreate} = useCart();

  return cartCreate;
}
