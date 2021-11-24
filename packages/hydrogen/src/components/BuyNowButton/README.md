<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/components/BuyNowButton and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/master/content/internal/operations/hydrogen-reference-docs.md. -->

The `BuyNowButton` component renders a button that adds an item to the cart and redirects the customer to checkout.

## Example code

```tsx
import {BuyNowButton} from '@shopify/hydrogen';

export function MyComponent() {
  return (
    <BuyNowButton quantity={1} variantId={'123'}>
      Buy it now
    </BuyNowButton>
  );
}
```

## Props

| Name        | Type                                                                 | Description                                                                       |
| ----------- | -------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| quantity?   | <code>number</code>                                                  | The item quantity. Defaults to 1.                                                 |
| variantId   | <code>string</code>                                                  | The ID of the variant.                                                            |
| attributes? | <code>Unknown<<wbr>UndocumentedType, UndocumentedType<wbr>>[]</code> | An array of cart line attributes that belong to the item being added to the cart. |
| children    | <code>ReactNode<<wbr>Imported<wbr>></code>                           | Any `ReactNode` elements.                                                         |

## Component type

The `BuyNowButton` component is a shared component, which means that it renders on both the server and the client. For more information about component types, refer to [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components).

## Related components

- [`SelectedVariantBuyNowButton`](/api/hydrogen/components/product-variant/selectedvariantbuynowbutton)
