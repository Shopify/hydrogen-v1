---
gid: 7326d7ca-fafe-11eb-9a03-0242ac130003
title: ProductPrice
description: The ProductPrice component renders a Money component with the product priceRange's maxVariantPrice or minVariantPrice, for either the regular price or compare at price range.
---

The `ProductPrice` component renders a [`Money`](https://shopify.dev/api/hydrogen/components/primitive/money) component with the product
[`priceRange`](https://shopify.dev/api/storefront/reference/products/productpricerange)'s `maxVariantPrice` or `minVariantPrice`, for either the regular price or compare at price range.

## Example code

```tsx
import {ProductPrice} from '@shopify/hydrogen';

export function Product({product}) {
  return (
    <ProductPrice product={product} priceType="compareAt" valueType="max" />
  );
}
```

## Props

| Name       | Type                                          | Description                                                          |
| ---------- | --------------------------------------------- | -------------------------------------------------------------------- |
| priceType? | <code>"regular" &#124; "compareAt"</code>     | The type of price. Valid values: `regular` (default) or `compareAt`. |
| valueType? | <code>"max" &#124; "min" &#124; "unit"</code> | The type of value. Valid values: `min` (default), `max`, or `unit`.  |
| variantId? | <code>string</code>                           | The ID of the variant.                                               |

## Component type

The `ProductPrice` component is a client component, which means that it renders on the client. For more information about component types, refer to [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/framework/react-server-components).

## Related components

- [`ProductOptionsProvider`](https://shopify.dev/api/hydrogen/components/product-variant/productoptionsprovider)
- [`Money`](https://shopify.dev/api/hydrogen/components/primitive/money)
