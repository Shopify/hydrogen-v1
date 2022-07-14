---
gid: 7f04886e-d3f9-490d-87aa-7e655a0fbcf9
title: BuyNowButton
description: The BuyNowButton component renders a button that adds an item to the cart and redirects the customer to checkout.
---

The `BuyNowButton` component renders a button that adds an item to the cart and redirects the customer to checkout.

## Example code

```tsx
import {BuyNowButton} from '@shopify/hydrogen';

export function MyComponent() {
  return (
    <BuyNowButton quantity={1} variantId={'123'}>
      Buy it now
    </BuyNowButton>
  );
}
```

```tsx
// Override `onClick` default behavior
import {BuyNowButton} from '@shopify/hydrogen';

export function MyComponent() {
  const handleCustomOnClick = (event) => {
    event.preventDefault(); // prevents button from triggering default behaviour
    // custom click handler code
  };

  return (
    <BuyNowButton quantity={1} variantId={'123'} onClick={handleCustomOnClick}>
      Buy it now
    </BuyNowButton>
  );
}
```

```tsx
// Run an async action before the default `onClick` behaviour
import {BuyNowButton} from '@shopify/hydrogen';

export function MyComponent() {
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
    <BuyNowButton
      quantity={1}
      variantId={'123'}
      onClick={handleCustomOnClick}
      buttonRef={buttonRef}
    >
      Buy it now
    </BuyNowButton>
  );
}
```

## Props

| Name        | Type                                                                                                     | Description                                                                                                                                                                                      |
| ----------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| quantity?   | <code>number</code>                                                                                      | The item quantity. Defaults to `1`.                                                                                                                                                              |
| variantId   | <code>string</code>                                                                                      | The ID of the variant.                                                                                                                                                                           |
| attributes? | <code>Object<<wbr>string, string<wbr>>[]</code>                                                          | An array of cart line attributes that belong to the item being added to the cart.                                                                                                                |
| children    | <code>ReactNode<<wbr>Imported<wbr>></code>                                                               | Any `ReactNode` elements.                                                                                                                                                                        |
| onClick?    | <code>(event?: React.MouseEvent<<wbr>HTMLButtonElement, MouseEvent<wbr>>) => void &#124; boolean;</code> | A click event handler. Default behaviour triggers the click event, unless prevented.                                                                                                             |
| buttonRef?  | <code>Ref<<wbr>HTMLButtonElement<wbr>> </code>                                                           | A reference to the underlying button.                                                                                                                                                            |
| as?         | <code>React.ElementType</code> with `button` as default                                                  | Provides a React element or component to render as the underlying button. <br></br>For accessibility compliance, use either a `button` element or a component that renders an underlying button. |

## Component type

The `BuyNowButton` component is a shared component, which means that it renders on both the server and the client. For more information about component types, refer to [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/framework/react-server-components).
