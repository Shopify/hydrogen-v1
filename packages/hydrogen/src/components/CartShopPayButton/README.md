<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/components/CartShopPayButton and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/main/content/internal/operations/hydrogen-reference-docs.md. -->

The `CartShopPayButton` component renders a `ShopPayButton` for the items in the cart.
It must be a descendent of a `CartProvider` component.

## Example code

```tsx
import {CartShopPayButton, CartProvider} from '@shopify/hydrogen';

export default function MyComponent() {
  return (
    <CartProvider>
      <CartShopPayButton />
    </CartProvider>
  );
}
```

## Component type

The `CartShopPayButton` component is a client component, which means that it renders on the client. For more information about component types, refer to [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components).

## Related components

- [ShopPayButton](/api/hydrogen/components/primitive/shoppaybutton)
