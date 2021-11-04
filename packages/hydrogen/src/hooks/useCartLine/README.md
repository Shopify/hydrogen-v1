<!-- This file is generated from the source code. Edit the files in /packages/hydrogen/src/hooks/useCartLine and run 'yarn generate-docs' at the root of this repo. -->

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
| `attributes`  | The cart line's attributes.             |
| `merchandise` | The cart line's associated merchandise. |

## Related components

- [`CartLineProvider`](/api/hydrogen/components/cart/cartprovider)
