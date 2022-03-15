<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/components/CartLineProvider and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/main/content/internal/operations/reference-docs/hydrogen.md. -->

The `useCartLine` hook provides access to the cart line object. It must be a descendent of a `CartProvider` component.

## Example code

```tsx
import {CartLineProvider, useCart} from '@shopify/hydrogen';

export function App() {
  const {lines} = useCart();

  return lines.map((line) => {
    return (
      <CartLineProvider key={line.id} line={line}>
        {/* Your JSX */}
      </CartLineProvider>
    );
  });
}
```

## Props

| Name     | Type                          | Description               |
| -------- | ----------------------------- | ------------------------- |
| children | <code>ReactNode</code>        | Any `ReactNode` elements. |
| line     | <code>Cart['lines'][1]</code> | A cart line object.       |

## Component type

The `CartLineProvider` component is a client component, which means that it renders on the client. For more information about component types, refer to [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components).

## Related components

- [`CartLineImage`](/api/hydrogen/components/cart/cartlineimage)
- [`CartLinePrice`](/api/hydrogen/components/cart/cartlineprice)
- [`CartLineProductTitle`](/api/hydrogen/components/cart/cartlineproducttitle)
- [`CartLineQuantity`](/api/hydrogen/components/cart/cartlinequantity)
- [`CartLineQuantityAdjustButton`](/api/hydrogen/components/cart/cartlinequantityadjustbutton)

## Related hooks

- [`useCartLine`](/api/hydrogen/hooks/cart/usecartline)
