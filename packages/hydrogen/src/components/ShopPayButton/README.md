<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/components/ShopPayButton and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/master/content/internal/operations/hydrogen-reference-docs.md. -->

The `ShopPayButton` component renders a button that redirects to the Shop Pay checkout.

## Example code

```tsx
import {ShopPayButton} from '@shopify/hydrogen';

export function MyProduct({variantId}) {
  return <ShopPayButton variantIds={[variantId]} />;
}
```

## Props

| Name       | Type                  | Description                                                               |
| ---------- | --------------------- | ------------------------------------------------------------------------- |
| variantIds | <code>string[]</code> | An array of IDs of the variants to purchase with Shop Pay.                |
| className? | <code>string</code>   | A string of classes to apply to the `div` that wraps the Shop Pay button. |

## Component type

The `ShopPayButton` component is a client component, which means that it renders on the client. For more information about component types, refer to [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components).

## Used by

- [`SelectedVariantShopPayButton`](/api/hydrogen/components/product-variant/selectedvariantshoppaybutton)
- [`CartShopPayButton`](/api/hydrogen/components/cart/cartshoppaybutton)
