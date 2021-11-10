<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/components/SelectedVariantBuyNowButton and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/master/content/internal/operations/hydrogen-reference-docs.md. -->

The `SelectedVariantBuyNowButton` component renders a `BuyNowButton` for the product's selected variant.
Clicking this button automatically adds the selected variant to the cart and redirect the customer to checkout.
It must be a descendent of a `ProductProvider` component.

## Example code

```tsx
import {
  SelectedVariantBuyNowButton,
  ProductProvider,
  useProduct,
} from '@shopify/hydrogen';

export function ProductDetails({product}) {
  return (
    <ProductProvider value={product}>
      <SelectedVariantBuyNowButton>Buy it now</SelectedVariantBuyNowButton>
    </ProductProvider>
  );
}
```

## Alias

The `SelectedVariantBuyNowButton` component is aliased by the `Product.SelectedVariant.BuyNowButton` component. You can use whichever component you prefer.

## Component type

The `SelectedVariantBuyNowButton` component is a client component, which means that it renders on the client. For more information about component types, refer to [React Server Components](/api/hydrogen/framework/react-server-components).

## Related components

- [`ProductProvider`](/api/hydrogen/components/product-variant/productprovider)
- [`BuyNowButton`](/api/hydrogen/components/cart/buynowbutton)
