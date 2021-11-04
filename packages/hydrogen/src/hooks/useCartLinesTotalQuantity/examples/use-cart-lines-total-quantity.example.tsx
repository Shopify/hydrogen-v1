import {CartToggle, useCartLinesTotalQuantity} from '@shopify/hydrogen';

export function CartButton() {
  const quantity = useCartLinesTotalQuantity();

  return <CartToggle>Cart {quantity}</CartToggle>;
}
