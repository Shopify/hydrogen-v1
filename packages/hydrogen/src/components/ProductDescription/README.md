<!-- This file is generated from the source code. Edit the files in /packages/hydrogen/src/components/ProductDescription and run 'yarn generate-docs' at the root of this repo. -->

The `ProductDescription` component renders a `RawHtml` component with
the product's [`descriptionHtml`](/api/storefront/reference/products/product).
It must be a descendent of the `ProductProvider` component.

## Example code

```tsx
import {ProductDescription, ProductProvider} from '@shopify/hydrogen';

export function Product({product}) {
  return (
    <ProductProvider value={product}>
      <ProductDescription />
    </ProductProvider>
  );
}
```

## Alias

The `ProductDescription` component is aliased by `Product.Description`. You can use whichever component you prefer.

## Component type

The `ProductDescription` component is a client component, which means that it renders on the client. For more information about component types, refer to [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components).

## Related components

- [`ProductProvider`](/api/hydrogen/components/product-variant/productprovider)
- [`RawHtml`](/api/hydrogen/components/primitive/rawhtml)
