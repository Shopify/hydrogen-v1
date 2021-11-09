---
gid: c7df6e06-3c6c-4c35-b6fe-82bfac8b6b95
title: CartCheckoutButton
description: Use the CartCheckoutButton to render a button that redirects to checkoutUrl for the cart.
---

The `CartCheckoutButton` component renders a button that redirects to the checkout URL for the cart.

> Note:
> It must be a descendent of a `CartProvider` component.

## Component type

The `CartCheckoutButton` component is a client component, which means that it renders on the client. For more information about component types, refer to [React Server Components](/api/hydrogen/framework/react-server-components).

## Example code

{% codeblock file %}

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

{% endcodeblock %}

## Props

| Name       | Required | Description            |
| ---------- | -------- | ---------------------- |
| `children` | Yes      | A `ReactNode` element. |

## Related components

- [CartProvider](/api/hydrogen/components/cart/cartprovider)

## Related hooks

- [useCartCheckoutUrl](/api/hydrogen/hooks/cart/usecartcheckouturl)
