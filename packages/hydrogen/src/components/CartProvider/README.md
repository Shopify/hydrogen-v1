<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/components/CartProvider and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/main/content/internal/operations/hydrogen-reference-docs.md. -->

## Example code

```tsx
import {CartProvider} from '@shopify/hydrogen';

export function App() {
  return <CartProvider>{/* Your JSX */}</CartProvider>;
}
```

## Props

| Name                    | Required | Description                                                                                                                                            |
| ----------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `children`              | Yes      | Any `ReactNode` elements.                                                                                                                              |
| `data`                  | No       | A cart object from the Storefront API to populate the initial state of the provider.                                                                   |
| `numCartLines`          | No       | A callback that is invoked when the process to create a cart begins, but before the cart is created in the Storefront API.                             |
| `onCreate`              | No       | A callback that is invoked when the process to create a cart begins, but before the cart is created in the Storefront API.                             |
| `onLineAdd`             | No       | A callback that is invoked when the process to add a line item to the cart begins, but before the line item is added to the Storefront API.            |
| `onLineRemove`          | No       | A callback that is invoked when the process to remove a line item to the cart begins, but before the line item is removed from the Storefront API.     |
| `onLineUpdate`          | No       | A callback that is invoked when the process to update a line item in the cart begins, but before the line item is updated in the Storefront API.       |
| `onNoteUpdate`          | No       | A callback that is invoked when the process to add or update a note in the cart begins, but before the note is added or updated in the Storefront API. |
| `onBuyerIdentityUpdate` | No       | A callback that is invoked when the process to update the buyer identity begins, but before the buyer identity is updated in the Storefront API.       |
| `onAttributesUpdate`    | No       | A callback that is invoked when the process to update the cart attributes begins, but before the attributes are updated in the Storefront API.         |
| `onDiscountCodesUpdate` | No       | A callback that is invoked when the process to update the cart discount codes begins, but before the discount codes are updated in the Storefront API. |

## Component type

The `CartProvider` component is a client component, which means that it renders on the client. For more information about component types, refer to [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components).

## Related components

- [`AddToCartButton`](/api/hydrogen/components/cart/addtocartbutton)
- [`CartCheckoutButton`](/api/hydrogen/components/cart/cartcheckoutbutton)
- [`SelectedVariantAddToCartButton`](/api/hydrogen/components/product-variant/selectedvariantaddtocartbutton)

## Related hooks

- [`useCart`](/api/hydrogen/hooks/cart/usecart)
