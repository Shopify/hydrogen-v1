<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/components/SelectedVariantImage and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/master/content/internal/operations/hydrogen-reference-docs.md. -->

The `SelectedVariantImage` component renders an `Image` component for the product's selected variant's image.
It must be a descendent of a `ProductProvider` component.

## Example code

```tsx
import {SelectedVariantImage, ProductProvider} from '@shopify/hydrogen';

export function ProductDetails({product}) {
  return (
    <ProductProvider value={product}>
      <SelectedVariantImage />
    </ProductProvider>
  );
}
```

## Alias

The `SelectedVariantImage` component is aliased by the `Product.SelectedVariant.Image` component. You can use whichever component you prefer.

## Component type

The `SelectedVariantImage` component is a client component, which means that it renders on the client. For more information about component types, refer to [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components).

## Related components

- [`ProductProvider`](/api/hydrogen/components/product-variant/productprovider)
- [`Image`](/api/hydrogen/components/primitive/image)

## Related hooks

- [`useProductOptions`](/api/hydrogen/hooks/product-variant/useproductoptions)
