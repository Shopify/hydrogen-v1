<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/components/ShopPayButton and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/main/content/internal/operations/hydrogen-reference-docs.md. -->

The `ShopPayButton` component renders a button that redirects to the Shop Pay checkout.

## Example code

```tsx
import {ShopPayButton} from '@shopify/hydrogen';

export function MyProduct({variantId}) {
  return <ShopPayButton variantIds={[variantId]} />;
}
```

## Props

The `variantIds` and `variantIdsAndQuantities` props are mutually exclusive. You must pass either `variantIds` or `variantIdsAndQuantities` to the component - not both.

| Name                    | Type                                                                                             | Description                                                                                                                                                                                    |
| ----------------------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| variantIds              | <pre>{ <br> variantIds: string[]; <br> variantIdsAndQuantities?: never;<br>}</pre>               | An array of IDs of the variants to purchase with Shop Pay. This will only ever have a quantity of 1 for each variant. If you want to use other quantities, then use `variantIdsAndQuantities`. |
| variantIdsAndQuantities | <pre>{ <br> variantIds: never; <br> variantIdsAndQuantities?: VariantIdAndQuantity[];<br>}</pre> | An array of variant IDs and quantities to purchase with Shop Pay.                                                                                                                              |
| className?              | <code>string</code>                                                                              | A string of classes to apply to the `div` that wraps the Shop Pay button.                                                                                                                      |

## Component type

The `ShopPayButton` component is a client component, which means that it renders on the client. For more information about component types, refer to [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components).

## Used by

- [`CartShopPayButton`](/api/hydrogen/components/cart/cartshoppaybutton)
