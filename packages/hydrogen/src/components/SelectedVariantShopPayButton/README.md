<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/components/SelectedVariantShopPayButton and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/main/content/internal/operations/hydrogen-reference-docs.md. -->

The `SelectedVariantShopPayButton` component renders a `ShopPayButton` for the product's selected variant.
It must be a descendent of a `ProductProvider` component.

## Example code

```tsx
import {SelectedVariantShopPayButton, ProductProvider} from '@shopify/hydrogen';

export function ProductDetails({product}) {
  return (
    <ProductProvider data={product}>
      {/* Code for selecting the product variant */}
      <SelectedVariantShopPayButton />
    </ProductProvider>
  );
}
```

## Component type

The `SelectedVariantShopPayButton` component is a client component, which means that it renders on the client. For more information about component types, refer to [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components).

## Related components

- [`ShopPayButton`](/api/hydrogen/components/primitive/shoppaybutton)
