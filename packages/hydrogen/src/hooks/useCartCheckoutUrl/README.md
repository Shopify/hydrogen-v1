<!-- This file is generated from the source code. Edit the files in /packages/hydrogen/src/hooks/useCartCheckoutUrl and run 'yarn generate-docs' at the root of this repo. -->

The `useCartCheckoutUrl` hook returns a string of the checkout URL for the cart. It must be a descendent of a `CartProvider` component.

## Example code

```tsx
import {useCartCheckoutUrl} from '@shopify/hydrogen';

export function CheckoutLink() {
  const url = useCartCheckoutUrl();

  return <a href={url}>Checkout</a>;
}
```

## Return value

A string of the checkout URL for the cart.

## Related components

- [`CartProvider`](/api/hydrogen/components/cart/cartprovider)

## Related hooks

- [`useCart`](/api/hydrogen/hooks/cart/usecart)
