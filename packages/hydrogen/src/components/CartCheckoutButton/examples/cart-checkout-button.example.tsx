import {CartCheckoutButton, CartProvider} from '@shopify/hydrogen';

export default function MyComponent() {
  return (
    <CartProvider>
      <CartCheckoutButton>Checkout</CartCheckoutButton>
    </CartProvider>
  );
}
