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
| children | `ReactNode`        | Any `ReactNode` elements. |
| line     | `Cart['lines'][1]` | A cart line object.       |

## Component type

The `CartLineProvider` component is a client component, which means that it renders on the client. For more information about component types, refer to [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/react-server-components).

## Related components

- [`CartLineImage`](/components/cart/cartlineimage/)
- [`CartLinePrice`](/components/cart/cartlineprice/)
- [`CartLineProductTitle`](/components/cart/cartlineproducttitle/)
- [`CartLineQuantity`](/components/cart/cartlinequantity/)
- [`CartLineQuantityAdjustButton`](/components/cart/cartlinequantityadjustbutton/)

## Related hooks

- [`useCartLine`](/hooks/cart/usecartline/)
