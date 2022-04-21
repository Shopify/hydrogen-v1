---
url: /api/hydrogen/components/product-variant/productmetafield
title: ProductMetafield
description: The ProductMetafield component renders a Metafield component with the product metafield.
---

The `ProductMetafield` component renders a
[`Metafield`](/api/hydrogen/components/primitive/metafield) component with the product metafield.
It must be a descendent of a `ProductProvider` component.

## Example code

```tsx
import {ProductProvider, ProductMetafield} from '@shopify/hydrogen';

export function Product({product}) {
  return (
    <ProductProvider data={product}>
      <ProductMetafield namespace="my_fields" keyName="manufacture_date" />
    </ProductProvider>
  );
}
```

## Props

| Name       | Type                | Description                                                                                                                    |
| ---------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| keyName    | <code>string</code> | A string corresponding to the [key](/api/storefront/reference/common-objects/metafield) of the product's metafield.            |
| namespace  | <code>string</code> | A string corresponding to the [namespace](/api/storefront/reference/common-objects/metafield) of the product's metafield.      |
| variantId? | <code>string</code> | The ID of the variant. If provided, then use the metafield corresponding to the variant ID instead of the product's metafield. |

## Component type

The `ProductMetafield` component is a client component, which means that it renders on the client. For more information about component types, refer to [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components).

## Related components

- [`Metafield`](/api/hydrogen/components/primitive/metafield)
