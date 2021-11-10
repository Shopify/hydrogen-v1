<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/components/CartProvider and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/master/content/internal/operations/hydrogen-reference-docs.md. -->

## Example code

```tsx
import {CartProvider} from '@shopify/hydrogen';

export function App() {
  return <CartProvider>{/* Your JSX */}</CartProvider>;
}
```

## Component type

The `CartProvider` component is a client component, which means that it renders on the client. For more information about component types, refer to [React Server Components](/api/hydrogen/framework/react-server-components).

## Related components

- [`AddToCartButton`](/api/hydrogen/components/cart/addtocartbutton)
- [`CartCheckoutButton`](/api/hydrogen/components/cart/cartcheckoutbutton)
- [`SelectedVariantAddToCartButton`](/api/hydrogen/components/product-variant/selectedvariantaddtocartbutton)

## Related hooks

- [`useCart`](/api/hydrogen/hooks/cart/usecart)
- [`useCartBuyerIdentityUpdateCallback`](/api/hydrogen/hooks/cart/usecartbuyeridentityupdatecallback)
- [`useCartCheckoutUrl`](/api/hydrogen/hooks/cart/usecartcheckouturl)
- [`useCartCreateCallback`](/api/hydrogen/hooks/cart/usecartcreatecallback)
- [`useCartDiscountCodesUpdateCallback`](/api/hydrogen/hooks/cart/usecartdiscountcodesupdatecallback)
- [`useCartLinesAddCallback`](/api/hydrogen/hooks/cart/usecartlinesaddcallback)
- [`useCartLinesRemoveCallback`](/api/hydrogen/hooks/cart/usecartlinesremovecallback)
- [`useCartLinesTotalQuantity`](/api/hydrogen/hooks/cart/usecartlinestotalquantity)
- [`useCartLinesUpdateCallback`](/api/hydrogen/hooks/cart/usecartlinesupdatecallback)
