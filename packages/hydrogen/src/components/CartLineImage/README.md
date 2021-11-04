<!-- This file is generated from the source code. Edit the files in /packages/hydrogen/src/components/CartLineImage and run 'yarn generate-docs' at the root of this repo. -->

The `CartLineImage` component renders an `Image` component for the cart line merchandise's image.
It must be a descendent of a `CartLineProvider` component.

## Example code

```tsx
import {CartLineProvider, useCart, CartLineImage} from '@shopify/hydrogen';

export function App() {
  const {lines} = useCart();

  return lines.map((line) => {
    return (
      <CartLineProvider key={line.id} line={line}>
        <CartLineImage />
      </CartLineProvider>
    );
  });
}
```

## Alias

The `CartLineImage` component is aliased by the `CartLine.Image` component. You can use whichever component you prefer.

## Component type

The `CartLineImage` component is a client component, which means that it renders on the client. For more information about component types, refer to [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components).

## Related components

- [`CartLineProvider`](/api/hydrogen/components/cart/cartlineprovider)
- [`Image`](/api/hydrogen/components/primitive/image)
