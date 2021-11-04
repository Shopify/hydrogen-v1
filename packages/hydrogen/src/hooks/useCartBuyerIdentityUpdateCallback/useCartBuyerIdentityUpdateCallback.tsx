import {useCart} from '../useCart';

/**
 * The `useCartBuyerIdentityUpdateCallback` hook returns a callback that can be used to update the cart's buyer identity. It must be a descendent of a `CartProvider` component.
 */
export function useCartBuyerIdentityUpdateCallback() {
  const {buyerIdentityUpdate} = useCart();

  return buyerIdentityUpdate;
}
