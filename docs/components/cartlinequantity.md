---
gid: c3685804-fafd-11eb-9a03-0242ac130003
title: CartLineQuantity
description: The CartLineQuantity component renders a span element (or the type of HTML element specified by the as prop) with the cart line's quantity.
---

The `CartLineQuantity` component renders a `span` element (or the type of HTML element
specified by the `as` prop) with the cart line's quantity. It must be a descendent of a `CartLineProvider` component.

## Example code

```tsx
import {CartLineProvider, useCart, CartLineQuantity} from '@shopify/hydrogen';

export function App() {
  const {lines} = useCart();

  return lines.map((line) => {
    return (
      <CartLineProvider key={line.id} line={line}>
        <CartLineQuantity />
      </CartLineProvider>
    );
  });
}
```

## Props

| Name | Type              | Description                                                                   |
| ---- | ----------------- | ----------------------------------------------------------------------------- |
| `as` | <code>TTag</code> | An HTML tag to be rendered as the base element wrapper. The default is `div`. |

## Component type

The `CartLineQuantity` component is a client component, which means that it renders on the client. For more information about component types, refer to [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/framework/react-server-components).

## Related components

- [`CartLineProvider`](https://shopify.dev/api/hydrogen/components/cart/cartlineprovider)
