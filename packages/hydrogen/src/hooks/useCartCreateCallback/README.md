<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/hooks/useCartCreateCallback and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/master/content/internal/operations/hydrogen-reference-docs.md. -->

The `useCartCreateCallback` hook returns a callback that can be used to create a cart. It must be a descendent of a `CartProvider` component.

## Example code

```tsx
import {useCartCreateCallback} from '@shopify/hydrogen';

export function CustomAddToCartButton() {
  const createCart = useCartCreateCallback();

  return (
    <button
      onClick={() => {
        // if no cart exists, create it
        createCart({
          lines: [
            {
              quantity: 1,
              merchandiseId: '1234',
            },
          ],
        });
      }}
    >
      Add to cart
    </button>
  );
}
```

## Return value

A callback to create a new cart. It expects one argument that corresponds to the input you would provide to the Storefront API's [cartCreate](/api/storefront/reference/cart/cartcreate) mutation.

## Related components

- [`CartProvider`](/api/hydrogen/components/cart/cartprovider)

## Related hooks

- [`useCart`](/api/hydrogen/hooks/cart/usecart)
