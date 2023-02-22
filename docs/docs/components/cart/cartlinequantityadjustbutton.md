# CartLineQuantityAdjustButton


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

```tsx
// Override `onClick` default behaviour
import {
  CartLineProvider,
  useCart,
  CartLineQuantityAdjustButton,
} from '@shopify/hydrogen';

export function App() {
  const {lines} = useCart();

  const handleCustomOnClick = (event) => {
    event.preventDefault(); // prevents button from triggering default behaviour
    // custom click handler code
  };

  return lines.map((line) => {
    return (
      <CartLineProvider key={line.id} line={line}>
        <CartLineQuantityAdjustButton
          adjust="increase"
          onClick={handleCustomOnClick}
        >
          Increase quantity
        </CartLineQuantityAdjustButton>
      </CartLineProvider>
    );
  });
}
```

```tsx
// Run an async action before the default `onClick` behaviour
import {
  CartLineProvider,
  useCart,
  CartLineQuantityAdjustButton,
} from '@shopify/hydrogen';

export function App() {
  const {lines} = useCart();
  const performed = useRef();
  const buttonRef = useRef();

  const handleCustomOnClick = async (event) => {
    if (performed.current) {
      performed.current = false;
      return;
    }

    event.preventDefault(); // stop default behaviour
    console.log(`Performing custom action...`);
    await new Promise((r) => setTimeout(r, 500));
    console.log(`Custom action complete!`);

    performed.current = true; // prevents retriggering
    buttonRef.current.click(); // trigger button default behaviour
  };

  return lines.map((line) => {
    return (
      <CartLineProvider key={line.id} line={line}>
        <CartLineQuantityAdjustButton
          adjust="increase"
          onClick={handleCustomOnClick}
          buttonRef={buttonRef}
        >
          Increase quantity
        </CartLineQuantityAdjustButton>
      </CartLineProvider>
    );
  });
}
```

## Props

| Name       | Type                                                                                                     | Description                                                                                                                                                                                      |
| ---------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| adjust     | `"increase" &#124; "decrease" &#124; "remove"`                                                | The adjustment for a cart line's quantity. Valid values: `increase` (default), `decrease`, or `remove`.                                                                                          |
| children   | `ReactNode`                                                                                   | Any `ReactNode` elements.                                                                                                                                                                        |
| onClick?   | `(event?: React.MouseEvent<<wbr>HTMLButtonElement, MouseEvent<wbr>>) => void &#124; boolean;` | A click event handler. Default behaviour triggers the click event, unless prevented.                                                                                                             |
| buttonRef? | `Ref<<wbr>HTMLButtonElement<wbr>> `                                                           | A reference to the underlying button.                                                                                                                                                            |
| as?        | `React.ElementType` with `button` as default                                                  | Provides a React element or component to render as the underlying button. <br />For accessibility compliance, use either a `button` element or a component that renders an underlying button. |

## Component type

The `CartLineQuantityAdjustButton` component is a shared component, which means that it renders on both the server and the client. For more information about component types, refer to [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/react-server-components).

## Related components

- [`CartLineProvider`](/components/cart/cartlineprovider/)
