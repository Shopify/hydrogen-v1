import {useCart} from '../useCart';

/**
 * The `useCartAttributesUpdateCallback` hook returns a callback that can be used to update the cart's attributes. It must be a descendent of a `CartProvider` component.
 */
export function useCartAttributesUpdateCallback() {
  const {cartAttributesUpdate} = useCart();

  return cartAttributesUpdate;
}
