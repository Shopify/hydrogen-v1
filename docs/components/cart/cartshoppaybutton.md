---
gid: fa707408-fafd-11eb-9a03-0242ac130003
title: CartShopPayButton
description: The CartShopPayButton component renders a ShopPayButton for the items in the cart.
---

The `CartShopPayButton` component renders a `ShopPayButton` for the items in the cart.
It must be a descendent of a `CartProvider` component.

## Example code

```tsx
import {CartShopPayButton, CartProvider} from '@shopify/hydrogen';

export default function MyComponent() {
  return (
    <CartProvider>
      <CartShopPayButton />
    </CartProvider>
  );
}
```

## Props

| Name       | Type                                                                                         | Description                                                                               |
| ---------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| className? | <code>Omit&#60;React.ComponentProps&#60;typeof ShopPayButton&#62;, 'variantIds'&#62;)</code> | A string of classes to apply to the `div` that wraps the `shop-pay-button` web component. |
| width? | <code>string</code> |   A string that's applied to the [CSS custom property (variable)](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) `--shop-pay-button-width` for the [Buy with Shop Pay component](https://shopify.dev/custom-storefronts/tools/web-components#buy-with-shop-pay-component). |

## Component type

The `CartShopPayButton` component is a client component, which means that it renders on the client. For more information about component types, refer to [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/framework/react-server-components).

## Related components

- [ShopPayButton](https://shopify.dev/api/hydrogen/components/primitive/shoppaybutton)
