---
gid: 6d33cdaa-fafe-11eb-9a03-0242ac130003
title: ProductDescription
description: The ProductDescription component renders a div component with the product's descriptionHtml.
---

The `ProductDescription` component renders a `div` component with
the product's [`descriptionHtml`](/api/storefront/reference/products/product).
It must be a descendent of the `ProductProvider` component.

## Example code

```tsx
import {ProductDescription, ProductProvider} from '@shopify/hydrogen';

export function Product({product}) {
  return (
    <ProductProvider data={product}>
      <ProductDescription />
    </ProductProvider>
  );
}
```

## Component type

The `ProductDescription` component is a client component, which means that it renders on the client. For more information about component types, refer to [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components).

## Related components

- [`ProductProvider`](/api/hydrogen/components/product-variant/productprovider)
