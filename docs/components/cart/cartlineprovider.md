# CartLineProvider


The `CartLineProvider` component creates a context for using a cart line.

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

The `CartLineProvider` component is a client component, which means that it renders on the client. For more information about component types, refer to [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/react-server-components).

## Related components

- [`CartLineImage`](https://shopify.dev/api/hydrogen/components/cart/cartlineimage)
- [`CartLinePrice`](https://shopify.dev/api/hydrogen/components/cart/cartlineprice)
- [`CartLineProductTitle`](https://shopify.dev/api/hydrogen/components/cart/cartlineproducttitle)
- [`CartLineQuantity`](https://shopify.dev/api/hydrogen/components/cart/cartlinequantity)
- [`CartLineQuantityAdjustButton`](https://shopify.dev/api/hydrogen/components/cart/cartlinequantityadjustbutton)

## Related hooks

- [`useCartLine`](https://shopify.dev/api/hydrogen/hooks/cart/usecartline)
