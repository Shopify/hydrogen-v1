---
gid: 7f04886e-d3f9-490d-87aa-7e655a0fbcf8
title: useCartLine
description: The useCartLine hook provides access to the cart line object.
---

The `useCartLine` hook provides access to the cart line object. It must be a descendent of a `CartProvider` component.

## Example code

```tsx
import {CartLineProvider, useCartLine, useCart} from '@shopify/hydrogen';

export function MyComponent() {
  const {lines} = useCart();

  return lines.map((line) => {
    return (
      <CartLineProvider>
        <CartLineItem />
      </CartLineProvider>
    );
  });
}

export function CartLineItem() {
  const {price, productTitle, quantity} = useCartLine();

  return (
    <>
      <h2>{productTitle}</h2>
      <span>{price}</span>
      <span>{quantity}</span>
    </>
  );
}
```

## Return value

The `useCartLine` hook returns an object with the following keys:

| Name          | Description                             |
| ------------- | --------------------------------------- |
| `id`          | The cart line's ID.                     |
| `quantity`    | The cart line's quantity.               |
| `attributes`  | The cart line's [attributes](https://shopify.dev/api/storefront/latest/objects/cartline).             |
| `merchandise` | The cart line's associated [merchandise](https://shopify.dev/api/storefront/latest/objects/cartline). |

## Related components

- [`CartLineProvider`](https://shopify.dev/api/hydrogen/components/cart/cartprovider)
