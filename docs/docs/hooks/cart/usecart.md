# useCart


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

| Name                   | Description                                                                                                                                                                                                                                                                                                                               |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                   | The cart ID.                                                                                                                                                                                                                                                                                                                              |
| `lines`                | The cart lines.                                                                                                                                                                                                                                                                                                                           |
| `checkoutUrl`          | The URL for the checkout for this cart.                                                                                                                                                                                                                                                                                                   |
| `note`                 | The cart note.                                                                                                                                                                                                                                                                                                                            |
| `buyerIdentity`        | The cart's buyer identity.                                                                                                                                                                                                                                                                                                                |
| `attributes`           | The cart attributes.                                                                                                                                                                                                                                                                                                                      |
| `discountCodes`        | The discount codes applied to the cart.                                                                                                                                                                                                                                                                                                   |
| `cost`        | The cost for the cart, including the subtotal, total, taxes, and duties.                                                                                                                                                                                                                                                        |
| `status`               | The status of the cart. This returns 'uninitialized' when the cart is not yet created, 'creating' when the cart is being created, 'updating' when the cart is updating, and 'idle' when the cart isn't being created or updated.                                                                                                          |
| `error`                | A string of an error from a cart action, such as adding or removing an item from the cart. If an error does occur, then the cart is put back into the last valid state it was in.                                                                                                                                                         |
| `cartCreate`           | A callback that creates a cart. Expects the same input you would provide to the Storefront API's [cartCreate](https://shopify.dev/api/storefront/reference/cart/cartcreate) mutation.                                                                                                                                                     |
| `linesAdd`             | A callback that adds lines to the cart. Expects the same `lines` input that you would provide to the Storefront API's [cartLinesAdd](https://shopify.dev/api/storefront/reference/cart/cartlinesadd) mutation. If a cart doesn't already exist, then it will create the cart for you.                                                     |
| `linesRemove`          | A callback that removes lines from the cart. Expects the same `lines` input that you would provide to the Storefront API's [cartLinesRemove](https://shopify.dev/api/storefront/reference/cart/cartlinesremove) mutation. Only lines that are included in the `lines` parameter will be in the cart afterwards.                           |
| `linesUpdate`          | A callback that updates lines in the cart. Expects the same `lines` input that you would provide to the Storefront API's [cartLinesUpdate](https://shopify.dev/api/storefront/reference/cart/cartlinesupdate) mutation. If a line item is not included in the `lines` parameter, it will still exist in the cart and will not be changed. |
| `noteUpdate`           | A callback that updates the note in the cart. Expects the same `note` input that you would provide to the Storefront API's [cartNoteUpdate](https://shopify.dev/api/storefront/reference/cart/cartnoteupdate) mutation.                                                                                                                   |
| `buyerIdentityUpdate`  | A callback that updates the buyer identity in the cart. Expects the same `buyerIdentity` input that you would provide to the Storefront API's [cartBuyerIdentityUpdate](https://shopify.dev/api/storefront/reference/cart/cartbuyeridentityupdate) mutation.                                                                              |
| `cartAttributesUpdate` | A callback that updates the cart attributes. Expects the same `attributes` input that you would provide to the Storefront API's [cartAttributesUpdate](https://shopify.dev/api/storefront/reference/cart/cartattributesupdate) mutation.                                                                                                  |
| `discountCodesUpdate`  | A callback that updates the cart's discount codes. Expects the same `codes` input that you would provide to the Storefront API's [cartDiscountCodesUpdate](https://shopify.dev/api/storefront/reference/cart/cartdiscountcodesupdate) mutation.                                                                                           |
| `totalQuantity`        | The total number of items in the cart, across all lines. If there are no lines, then the value is 0.                                                                                                                                                                                                                                      |

## Related components

- [`CartProvider`](/components/cart/cartprovider/)
