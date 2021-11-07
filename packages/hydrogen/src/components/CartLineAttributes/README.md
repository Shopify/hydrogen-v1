<!-- This file is generated from the source code. Edit the files in /packages/hydrogen/src/components/CartLineAttributes and run 'yarn generate-docs' at the root of this repo. -->

The `CartLineAttributes` component takes a function as a child and calls that function for each of the
cart line's attributes. It must be a descendent of a `CartLineProvider` component.

## Example code

```tsx
import {CartLineProvider, useCart, CartLineAttributes} from '@shopify/hydrogen';

export function App() {
  const {lines} = useCart();

  return lines.map((line) => {
    return (
      <CartLineProvider key={line.id} line={line}>
        <CartLineAttributes>
          {({key, value}) => (
            <>
              {key}: {value}
            </>
          )}
        </CartLineAttributes>
      </CartLineProvider>
    );
  });
}
```

## Render props

The `CartLineAttributes` components provides an object with the following keys as a render prop:

| Key     | Description                      |
| ------- | -------------------------------- |
| `key`   | The key value for the attribute. |
| `value` | The value for the attribute.     |

## Component type

The `CartLineAttributes` component is a client component, which means that it renders on the client. For more information about component types, refer to [React Server Components](/api/hydrogen/framework/react-server-components).

## Alias

The `CartLineAttributes` component is aliased by the `CartLine.Attributes` component. You can use whichever component you prefer.

## Related components

- [`CartLineProvider`](/api/hydrogen/components/cart/cartlineprovider)
