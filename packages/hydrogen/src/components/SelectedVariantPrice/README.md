<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/components/SelectedVariantPrice and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/master/content/internal/operations/hydrogen-reference-docs.md. -->

The `SelectedVariantPrice` component renders a `Money` component for the product's selected variant's price or compare at price.
It must be a descendent of a `ProductProvider` component.

## Example code

```tsx
import {SelectedVariantPrice, ProductProvider} from '@shopify/hydrogen';

export function ProductDetails({product}) {
  return (
    <ProductProvider value={product}>
      <SelectedVariantPrice priceType="compareAt" />
    </ProductProvider>
  );
}
```

## Props

| Name       | Type                                      | Description                                                          |
| ---------- | ----------------------------------------- | -------------------------------------------------------------------- |
| priceType? | <code>"regular" &#124; "compareAt"</code> | The type of price. Valid values: `regular` (default) or `compareAt`. |

## Alias

The `SelectedVariantPrice` component is aliased by the `Product.SelectedVariant.Price` component. You can use whichever component you prefer.

## Component type

The `SelectedVariantPrice` component is a client component, which means that it renders on the client. For more information about component types, refer to [React Server Components](/api/hydrogen/framework/react-server-components).

## Related components

- [`ProductProvider`](/api/hydrogen/components/product-variant/productprovider)
- [`Money`](/api/hydrogen/components/primitive/money)

## Related hooks

- [`useProductOptions`](/api/hydrogen/hooks/product-variant/useproductoptions)
