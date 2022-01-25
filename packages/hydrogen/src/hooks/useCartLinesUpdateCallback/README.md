<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/hooks/useCartLinesUpdateCallback and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/main/content/internal/operations/hydrogen-reference-docs.md. -->

The `useCartLinesUpdateCallback` hook returns a callback that can be used to update lines in a cart. It must be a descendent of a `CartProvider` component.

## Example code

```tsx
import {useCartLinesUpdateCallback} from '@shopify/hydrogen';

export function CustomAdjustQuantityButton({lineId, newQuantity}) {
  const updateLines = useCartLinesUpdateCallback();

  return (
    <button
      onClick={() => {
        updateLines([
          {
            id: lineId,
            quantity: newQuantity,
          },
        ]);
      }}
    >
      +
    </button>
  );
}
```

## Return value

A callback to update lines in a cart. The callback expects one argument that corresponds to the input you would provide to the Storefront API's [`cartLinesUpdate`](/api/storefront/reference/cart/cartlinesupdate) mutation.

## Related components

- [`CartProvider`](/api/hydrogen/components/cart/cartprovider)

## Related hooks

- [`useCart`](/api/hydrogen/hooks/cart/usecart)
