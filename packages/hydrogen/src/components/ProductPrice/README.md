<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/components/ProductPrice and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/main/content/internal/operations/reference-docs/hydrogen.md. -->

The `ProductPrice` component renders a `Money` component with the product
[`priceRange`](/api/storefront/reference/products/productpricerange)'s `maxVariantPrice` or `minVariantPrice`, for either the regular price or compare at price range. It must be a descendent of the `ProductProvider` component.

## Example code

```tsx
import {ProductPrice, ProductProvider} from '@shopify/hydrogen';

export function Product({product}) {
  return (
    <ProductProvider data={product}>
      <ProductPrice priceType="compareAt" valueType="max" />
    </ProductProvider>
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

The `ProductPrice` component is a client component, which means that it renders on the client. For more information about component types, refer to [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components).

## Related components

- [`ProductProvider`](/api/hydrogen/components/product-variant/productprovider)
- [`Money`](/api/hydrogen/components/primitive/money)
