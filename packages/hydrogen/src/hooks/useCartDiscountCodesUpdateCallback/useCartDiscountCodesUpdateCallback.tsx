import {useCart} from '../useCart';

/**
 * The `useCartDiscountCodesUpdateCallback` hook returns a callback that can be used to update the cart's discount codes. It must be a descendent of a `CartProvider` component.
 */
export function useCartDiscountCodesUpdateCallback() {
  const {discountCodesUpdate} = useCart();

  return discountCodesUpdate;
}
