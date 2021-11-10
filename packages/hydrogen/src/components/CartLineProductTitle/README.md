<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/components/CartLineProductTitle and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/master/content/internal/operations/hydrogen-reference-docs.md. -->

The `CartLineProductTitle` component renders a `span` element (or the type of HTML element specified by
the `as` prop) with the cart line merchandise's title. It must be a descendent of a `CartLineProvider` component.

## Example code

```tsx
import {
  CartLineProvider,
  useCart,
  CartLineProductTitle,
} from '@shopify/hydrogen';

export function App() {
  const {lines} = useCart();

  return lines.map((line) => {
    return (
      <CartLineProvider key={line.id} line={line}>
        <CartLineProductTitle />
      </CartLineProvider>
    );
  });
}
```

## Alias

The `CartLineProductTitle` component is aliased by the `CartLine.ProductTitle` component. You can use whichever component you prefer.

## Component type

The `CartLineProductTitle` component is a client component, which means that it renders on the client. For more information about component types, refer to [React Server Components](/api/hydrogen/framework/react-server-components).

## Related components

- [`CartLineProvider`](/api/hydrogen/components/cart/cartlineprovider)
