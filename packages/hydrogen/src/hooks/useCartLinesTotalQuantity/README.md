<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/hooks/useCartLinesTotalQuantity and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/main/content/internal/operations/hydrogen-reference-docs.md. -->

The `useCartLinesTotalQuantity` hook returns the total amount of items in the cart. It must be a descendent of a `CartProvider` component.

## Example code

```tsx
import {CartToggle, useCartLinesTotalQuantity} from '@shopify/hydrogen';

export function CartButton() {
  const quantity = useCartLinesTotalQuantity();

  return <CartToggle>Cart {quantity}</CartToggle>;
}
```

## Return value

The total amount of items in the cart.

## Related components

- [`CartProvider`](/api/hydrogen/components/cart/cartprovider)

## Related hooks

- [`useCart`](/api/hydrogen/hooks/cart/usecart)
