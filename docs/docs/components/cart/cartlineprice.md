# CartLinePrice


The `CartLinePrice` component renders a `Money` component for the cart line merchandise's price or
compare at price. It must be a descendent of a `CartLineProvider` component.

## Example code

```tsx
import {CartLineProvider, useCart, CartLinePrice} from '@shopify/hydrogen';

export function App() {
  const {lines} = useCart();

  return lines.map((line) => {
    return (
      <CartLineProvider key={line.id} line={line}>
        <CartLinePrice priceType="compareAt" />
      </CartLineProvider>
    );
  });
}
```

## Props

| Name       | Type                                      | Description                                                         |
| ---------- | ----------------------------------------- | ------------------------------------------------------------------- |
| priceType? | `"regular" &#124; "compareAt"` | The type of price. Valid values:`regular` (default) or `compareAt`. |

## Component type

The `CartLinePrice` component is a client component, which means that it renders on the client. For more information about component types, refer to [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/react-server-components).

## Related components

- [`CartLineProvider`](/components/cart/cartlineprovider/)
- [`Money`](/components/primitive/money/)
