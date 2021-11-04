<!-- This file is generated from the source code. Edit the files in /packages/hydrogen/src/components/CartLineQuantityAdjustButton and run 'yarn generate-docs' at the root of this repo. -->

The `CartLineQuantityAdjustButton` component renders a button that adjusts the cart line's quantity when pressed.
It must be a descendent of a `CartLineProvider` component.

## Example code

```tsx
import {
  CartLineProvider,
  useCart,
  CartLineQuantityAdjustButton,
} from '@shopify/hydrogen';

export function App() {
  const {lines} = useCart();

  return lines.map((line) => {
    return (
      <CartLineProvider key={line.id} line={line}>
        <CartLineQuantityAdjustButton adjust="increase">
          Increase quantity
        </CartLineQuantityAdjustButton>
        <CartLineQuantityAdjustButton adjust="decrease">
          Decrease quantity
        </CartLineQuantityAdjustButton>
        <CartLineQuantityAdjustButton adjust="remove">
          Remove from cart
        </CartLineQuantityAdjustButton>
      </CartLineProvider>
    );
  });
}
```

## Alias

The `CartLineQuantityAdjustButton` component is aliased by the `CartLine.QuantityAdjust` component. You can use whichever component you prefer.

## Component type

The `CartLineQuantityAdjustButton` component is a shared component, which means that it renders on both the server and the client. For more information about component types, refer to [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components).

## Related components

- [`CartLineProvider`](/api/hydrogen/components/cart/cartlineprovider)
