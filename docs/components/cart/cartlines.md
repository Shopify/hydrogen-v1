# CartLines


The `CartLines` component iterates over each cart line and renders its `children` within
a `CartLineProvider` for each cart line.

## Example code

```tsx
import {
  CartLines,
  CartLineImage,
  CartLineProductTitle,
  CartLinePrice,
  Link,
} from '@shopify/hydrogen';

export function MyComponent() {
  return (
    <CartLines>
      <CartLineImage />
      <CartLineProductTitle />
      <CartLinePrice />
    </CartLines>
  );
}

export function MyComponentWithRenderProps() {
  return (
    <CartLines>
      {({merchandise}) => (
        <Link to={`/product/${merchandise.handle}`}>
          {merchandise.product.title}
        </Link>
      )}
    </CartLines>
  );
}
```

## Props

| Name     | Type                   | Description                                                                                                             |
| -------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| as?      | <code>"ul"</code>      | A `ReactNode` element. Valid values: `ul` or `undefined`. If `ul`, then each child will be wrapped with a `li` element. |
| children | <code>ReactNode</code> | A `ReactNode` element.                                                                                                  |

## Component type

The `CartLines` component is a shared component, which means that it renders on both the server and the client. For more information about component types, refer to [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/react-server-components).

## Related components

- [`CartLineImage`](https://shopify.dev/api/hydrogen/components/cart/cartlineimage)
- [`CartLinePrice`](https://shopify.dev/api/hydrogen/components/cart/cartlineprice)
- [`CartLineProvider`](https://shopify.dev/api/hydrogen/components/cart/cartlineprovider)
- [`CartLineProductTitle`](https://shopify.dev/api/hydrogen/components/cart/cartlineproducttitle)
- [`CartLineQuantity`](https://shopify.dev/api/hydrogen/components/cart/cartlinequantity)
- [`CartLineQuantityAdjustButton`](https://shopify.dev/api/hydrogen/components/cart/cartlinequantityadjustbutton)

## Related hooks

- [`useCartLine`](https://shopify.dev/api/hydrogen/hooks/cart/usecart)
