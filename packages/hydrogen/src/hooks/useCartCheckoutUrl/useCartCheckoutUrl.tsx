import {useCart} from '../useCart';

/**
 * The `useCartCheckoutUrl` hook returns a string of the checkout URL for the cart. It must be a descendent of a `CartProvider` component.
 */
export function useCartCheckoutUrl() {
  const {checkoutUrl} = useCart();

  return checkoutUrl;
}
