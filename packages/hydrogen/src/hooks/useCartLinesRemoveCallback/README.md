<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/hooks/useCartLinesRemoveCallback and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/master/content/internal/operations/hydrogen-reference-docs.md. -->

The `useCartLinesRemoveCallback` hook returns a callback that can be used to remove lines from a cart. It must be a descendent of a `CartProvider` component.

## Example code

```tsx
import {useCartLinesRemoveCallback} from '@shopify/hydrogen';

export function RemoveFromCartButton({lineId}) {
  const removeLines = useCartLinesRemoveCallback();

  return (
    <button
      onClick={() => {
        removeLines([lineId]);
      }}
    >
      Remove from cart
    </button>
  );
}
```

## Return value

A callback to remove lines from a cart. The callback expects one argument that corresponds to the input you would provide to the Storefront API's [`cartLinesRemove`](/api/storefront/reference/cart/cartlinesremove) mutation.

## Related components

- [`CartProvider`](/api/hydrogen/components/cart/cartprovider)

## Related hooks

- [`useCart`](/api/hydrogen/hooks/cart/usecart)
