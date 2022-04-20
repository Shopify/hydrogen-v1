---
gid: b5a21e4e-fafd-11eb-9a03-0242ac130003
title: CartLineProductTitle
description: The CartLineProductTitle component renders a span element (or the type of HTML element specified by the as prop) with the cart line merchandise's title.
---

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

## Props

| Name | Type              | Description                                                                    |
| ---- | ----------------- | ------------------------------------------------------------------------------ |
| `as` | <code>TTag</code> | An HTML tag to be rendered as the base element wrapper. The default is `span`. |

## Component type

The `CartLineProductTitle` component is a client component, which means that it renders on the client. For more information about component types, refer to [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/framework/react-server-components).

## Related components

- [`CartLineProvider`](https://shopify.dev/api/hydrogen/components/cart/cartlineprovider)
