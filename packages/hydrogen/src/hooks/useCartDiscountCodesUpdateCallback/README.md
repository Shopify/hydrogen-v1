<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/hooks/useCartDiscountCodesUpdateCallback and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/master/content/internal/operations/hydrogen-reference-docs.md. -->

The `useCartDiscountCodesUpdateCallback` hook returns a callback that can be used to update the cart's discount codes. It must be a descendent of a `CartProvider` component.

## Example code

```tsx
import {useCartDiscountCodesUpdateCallback} from '@shopify/hydrogen';

export function CartDiscountCodeUpdate() {
  const updateDiscountCodes = useCartDiscountCodesUpdateCallback();
  const [discountCode, setDiscountCode] = useState();

  return (
    <>
      <input
        type="text"
        placeholder="Discount code"
        onChange={(event) => {
          setDiscountCode(event.target.value);
        }}
      />
      <button
        onClick={() => {
          updateDiscountCodes([discountCode]);
        }}
      >
        Apply
      </button>
    </>
  );
}
```

## Return value

A callback to update the cart's discount codes. The callback expects an array of strings corresponding to the discount codes to apply to the cart.

## Related components

- [`CartProvider`](/api/hydrogen/components/cart/cartprovider)

## Related hooks

- [`useCart`](/api/hydrogen/hooks/cart/usecart)
