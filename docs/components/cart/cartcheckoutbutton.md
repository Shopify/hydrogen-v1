---
gid: c7df6e06-3c6c-4c35-b6fe-82bfac8b6b95
title: CartCheckoutButton
description: The CartCheckoutButton renders a button that redirects to checkoutUrl for the cart.
---

The `CartCheckoutButton` component renders a button that redirects to the checkout URL for the cart. It must be a descendent of a `CartProvider` component.

## Example code

```jsx
import {CartCheckoutButton, CartProvider} from '@shopify/hydrogen';

export class MyComponent() {
  return (
    <CartProvider>
      <CartCheckoutButton>Checkout</CartCheckoutButton>
    </CartProvider>
  )
}
```

## Props

| Name     | Type                   | Description            |
| -------- | ---------------------- | ---------------------- |
| children | <code>ReactNode</code> | A `ReactNode` element. |

## Component type

The `CartCheckoutButton` component is a client component, which means that it renders on the client. For more information about component types, refer to [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/react-server-components).

## Related components

- [CartProvider](https://shopify.dev/api/hydrogen/components/cart/cartprovider)

## Related hooks

- [useCart](https://shopify.dev/api/hydrogen/hooks/cart/usecart)
