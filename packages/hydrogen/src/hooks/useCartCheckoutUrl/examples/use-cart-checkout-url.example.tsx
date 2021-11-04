import {useCartCheckoutUrl} from '@shopify/hydrogen';

export function CheckoutLink() {
  const url = useCartCheckoutUrl();

  return <a href={url}>Checkout</a>;
}
