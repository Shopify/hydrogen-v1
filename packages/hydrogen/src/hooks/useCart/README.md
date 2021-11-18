<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/hooks/useCart and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/master/content/internal/operations/hydrogen-reference-docs.md. -->

The `useCart` hook provides access to the cart object. It must be a descendent of a `CartProvider` component.

## Example code

```tsx
import {CartProvider, useCart} from '@shopify/hydrogen';

export function MyComponent() {
  return (
    <CartProvider>
      <CartLineItems />
    </CartProvider>
  );
}

export function CartLineItems() {
  const {lines} = useCart();

  return (
    <>
      {lines.map((line) => {
        return {
          /* your JSX*/
        };
      })}
    </>
  );
}
```

## Return value

The `useCart` hook returns an object with the following keys:

| Name                   | Description                                                                                                                                                                                                                               |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                   | The cart ID.                                                                                                                                                                                                                              |
| `lines`                | The cart lines.                                                                                                                                                                                                                           |
| `checkoutUrl`          | The URL for the checkout for this cart.                                                                                                                                                                                                   |
| `note`                 | The cart note.                                                                                                                                                                                                                            |
| `buyerIdentity`        | The cart's buyer identity.                                                                                                                                                                                                                |
| `attributes`           | The cart attributes.                                                                                                                                                                                                                      |
| `discountCodes`        | The discount codes applied to the cart.                                                                                                                                                                                                   |
| `estimatedCost`        | The estimate cost for the cart, including the subtotal, total, taxes, and duties.                                                                                                                                                         |
| `status`               | The status of the cart. This returns 'uninitialized' when the cart is not yet created, 'creating' when the cart is being created, 'updating' when the cart is updating, and 'idle' when the cart isn't being created or updated.          |
| `error`                | A string of an error from a cart action, such as adding or removing an item from the cart.                                                                                                                                                |
| `createCart`           | A callback that creates a cart. Expects the same input you would provide to the Storefront API's [cartCreate](/api/storefront/reference/cart/cartcreate) mutation.                                                                        |
| `linesAdd`             | A callback that adds lines to the cart. Expects the same `lines` input that you would provide to the Storefront API's [cartLinesAdd](/api/storefront/reference/cart/cartlinesadd) mutation.                                               |
| `linesRemove`          | A callback that removes lines from the cart. Expects the same `lines` input that you would provide to the Storefront API's [cartLinesRemove](/api/storefront/reference/cart/cartlinesremove) mutation.                                    |
| `linesUpdate`          | A callback that updates lines in the cart. Expects the same `lines` input that you would provide to the Storefront API's [cartLinesUpdate](/api/storefront/reference/cart/cartlinesupdate) mutation.                                      |
| `noteUpdate`           | A callback that updates the note in the cart. Expects the same `note` input that you would provide to the Storefront API's [cartNoteUpdate](/api/storefront/reference/cart/cartnoteupdate) mutation.                                      |
| `buyerIdentityUpdate`  | A callback that updates the buyer identity in the cart. Expects the same `buyerIdentity` input that you would provide to the Storefront API's [cartBuyerIdentityUpdate](/api/storefront/reference/cart/cartbuyeridentityupdate) mutation. |
| `cartAttributesUpdate` | A callback that updates the cart attributes. Expects the same `attributes` input that you would provide to the Storefront API's [cartAttributesUpdate](/api/storefront/reference/cart/cartattributesupdate) mutation.                     |
| `discountCodesUpdate`  | A callback that updates the cart's discount codes. Expects the same `codes` input that you would provide to the Storefront API's [cartDiscountCodesUpdate](/api/storefront/reference/cart/cartdiscountcodesupdate) mutation.              |

## Related components

- [`CartProvider`](/api/hydrogen/components/cart/cartprovider)

## Related hooks

- [`useCartLinesAddCallback`](/api/hydrogen/hooks/cart/usecartlinesaddcallback)
- [`useCartLinesRemoveCallback`](/api/hydrogen/hooks/cart/usecartlinesremovecallback)
- [`useCartLinesUpdateCallback`](/api/hydrogen/hooks/cart/usecartlinesupdatecallback)
- [`useCartCheckoutUrl`](/api/hydrogen/hooks/cart/usecartcheckouturl)
- [`useCartCreateCallback`](/api/hydrogen/hooks/cart/usecartcreatecallback)
- [`useCartLinesTotalQuantity`](/api/hydrogen/hooks/cart/usecartlinestotalquantity)
