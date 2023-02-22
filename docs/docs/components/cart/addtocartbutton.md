# AddToCartButton


The `AddToCartButton` component renders a button that adds an item to the cart when pressed.
It must be a descendent of the `CartProvider` component.

## Example code

```tsx
import {
  CartProvider,
  AddToCartButton,
} from '@shopify/hydrogen';

export function MyComponent() {
  // ...

  return (
    <CartProvider>
      <AddToCartButton
        variantId="1234"
        quantity={1}
        attributes={[{key: 'Engraving', value: 'Hello world'}]}
        accessibleAddingToCartLabel="Adding item to your cart"
      >
        Add to Cart
      </AddToCartButton>
    </CartProvider>
  );
}
```

```tsx
// Override `onClick` default behavior
import {
  CartProvider,
  AddToCartButton,
} from '@shopify/hydrogen';

export function MyComponent() {
  // ...

  const handleCustomOnClick = (event) => {
    event.preventDefault(); // prevents button from triggering default behaviour
    // custom click handler code
  };

  return (
    <CartProvider>
      <AddToCartButton
        variantId="1234"
        quantity={1}
        attributes={[{key: 'Engraving', value: 'Hello world'}]}
        accessibleAddingToCartLabel="Adding item to your cart"
        onClick={handleCustomOnClick}
      >
        Add to Cart
      </AddToCartButton>
    </CartProvider>
  );
}
```

```tsx
// Run an async action before the default `onClick` behaviour
import {
  CartProvider,
  AddToCartButton,
} from '@shopify/hydrogen';

export function MyComponent() {
  // ...
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

  return (
    <CartProvider>
        <AddToCartButton
          variantId="1234"
          quantity={1}
          attributes={[{key: 'Engraving', value: 'Hello world'}]}
          accessibleAddingToCartLabel="Adding item to your cart"
          onClick={handleCustomOnClick}
          buttonRef={buttonRef}
        >
          Add to Cart
        </AddToCartButton>
    </CartProvider>
  );
}
```

## Props

| Name                         | Type                                                                                                     | Description                                                                                                                                                                                      |
| ---------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| attributes?                  | `Object<<wbr>key, value<wbr>>[]`                                                              | An array of cart line attributes that belong to the item being added to the cart.                                                                                                                |
| sellingPlanId?                |`string`                                                                                      | The selling plan ID of the subscription product variant. A [selling plan](/apps/subscriptions/selling-plans) represents how a product can be sold and purchased.
| variantId?                   | `string &#124; null`                                                                          | The ID of the variant.                                                                                                                                                                           |
| quantity?                    | `number`                                                                                      | The item quantity.                                                                                                                                                                               |
| children                     | `ReactNode`                                                                                   | Any ReactNode elements.                                                                                                                                                                          |
| accessibleAddingToCartLabel? | `string`                                                                                      | The text that's announced by the screen reader when the item is being added to the cart. Used for accessibility purposes only and not displayed on the page.                                     |
| onClick?                     | `(event?: React.MouseEvent<<wbr>HTMLButtonElement, MouseEvent<wbr>>) => void &#124; boolean;` | A click event handler. Default behaviour triggers the click event, unless prevented.                                                                                                             |
| buttonRef?                   | `Ref<<wbr>HTMLButtonElement<wbr>> `                                                           | A reference to the underlying button.                                                                                                                                                            |
| as?                          | `React.ElementType` with `button` as default                                                  | Provides a React element or component to render as the underlying button. <br />For accessibility compliance, use either a `button` element or a component that renders an underlying button. |

## Component type

The `AddToCartButton` component is a client component, which means that it renders on the client. For more information about component types, refer to [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/react-server-components).
