<!-- This file is generated from the source code. Edit the files in /packages/hydrogen/src/hooks/useCartLinesAddCallback and run 'yarn generate-docs' at the root of this repo. -->

The `useCartLinesAddCallback` hook returns a callback that can be used to add lines to a cart. If a cart doesn't
already exist, then it will create the cart for you. It must be a descendent of a `CartProvider` component.

## Example code

```tsx
import {useCartLinesAddCallback} from '@shopify/hydrogen';

export function CustomAddToCartButton() {
  const addLines = useCartLinesAddCallback();

  return (
    <button
      onClick={() => {
        addLines([
          {
            quantity: 1,
            merchandiseId: '1234',
          },
        ]);
      }}
    >
      Add to cart
    </button>
  );
}
```

## Return value

A callback to add new lines to a cart. The callback expects one argument that corresponds to the input you would provide to the Storefront API's [`cartLinesAdd`](/api/storefront/reference/cart/cartlinesadd) mutation.

## Related components

- [`CartProvider`](/api/hydrogen/components/cart/cartprovider)

## Related hooks

- [`useCart`](/api/hydrogen/hooks/cart/usecart)
