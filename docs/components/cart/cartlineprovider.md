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

- [`CartLineImage`](/docs/components/cart/cartlineimage.md)
- [`CartLinePrice`](/docs/components/cart/cartlineprice.md)
- [`CartLineProductTitle`](/docs/components/cart/cartlineproducttitle.md)
- [`CartLineQuantity`](/docs/components/cart/cartlinequantity.md)
- [`CartLineQuantityAdjustButton`](/docs/components/cart/cartlinequantityadjustbutton.md)

## Related hooks

- [`useCartLine`](/docs/hooks/cart/usecartline.md)
