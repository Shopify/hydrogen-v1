<!-- This file is generated from the source code. Edit the files in /packages/hydrogen/src/components/CartLineSelectedOptions and run 'yarn generate-docs' at the root of this repo. -->

The `CartLineSelectedOptions` component takes a function as a child and calls that function
for each of the cart line merchandise's selected options. It must be a descendent of a `CartLineProvider` component.

## Example code

```tsx
import {
  CartLineProvider,
  useCart,
  CartLineSelectedOptions,
} from '@shopify/hydrogen';

export function App() {
  const {lines} = useCart();

  return lines.map((line) => {
    return (
      <CartLineProvider key={line.id} line={line}>
        <CartLineSelectedOptions>
          {({name, value}) => (
            <>
              {name}: {value}
            </>
          )}
        </CartLineSelectedOptions>
      </CartLineProvider>
    );
  });
}
```

## Render props

The `CartLineSelectedOptions` components provides an object with the following keys as a render prop:

| Key     | Description                       |
| ------- | --------------------------------- |
| `name`  | The name value for the attribute. |
| `value` | The value for the attribute.      |

## Component type

The `CartLineSelectedOptions` component is a client component, which means that it renders on the client. For more information about component types, refer to [React Server Components](/api/hydrogen/framework/react-server-components).

## Alias

The `CartLineSelectedOptions` component is aliased by the `CartLine.SelectedOptions` component. You can use whichever component you prefer.

## Related components

- [`CartLineProvider`](/api/hydrogen/components/cart/cartlineprovider)
