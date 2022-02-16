<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/components/SelectedVariantUnitPrice and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/main/content/internal/operations/hydrogen-reference-docs.md. -->

The `SelectedVariantUnitPrice` component renders a `UnitPrice` component for the product's selected variant's unit price.
It must be a descendent of a `ProductProvider`.

## Example code

```tsx
import {SelectedVariantUnitPrice, ProductProvider} from '@shopify/hydrogen';

export function ProductDetails({product}) {
  return (
    <ProductProvider data={product}>
      <SelectedVariantUnitPrice />
    </ProductProvider>
  );
}
```

## Component type

The `SelectedVariantUnitPrice` component is a client component, which means that it renders on the client. For more information about component types, refer to [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components).

## Related components

- [`ProductProvider`](/api/hydrogen/components/product-variant/productprovider)
- [`UnitPrice`](/api/hydrogen/components/primitive/unitprice)

## Related hooks

- [`useProductOptions`](/api/hydrogen/hooks/product-variant/useproductoptions)
