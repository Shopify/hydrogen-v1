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
| as?      | `"ul"`      | A `ReactNode` element. Valid values: `ul` or `undefined`. If `ul`, then each child will be wrapped with a `li` element. |
| children | `ReactNode` | A `ReactNode` element.                                                                                                  |

## Component type

The `CartLines` component is a shared component, which means that it renders on both the server and the client. For more information about component types, refer to [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/react-server-components).

## Related components

- [`CartLineImage`](/components/cart/cartlineimage/)
- [`CartLinePrice`](/components/cart/cartlineprice/)
- [`CartLineProvider`](/components/cart/cartlineprovider/)
- [`CartLineProductTitle`](/components/cart/cartlineproducttitle/)
- [`CartLineQuantity`](/components/cart/cartlinequantity/)
- [`CartLineQuantityAdjustButton`](/components/cart/cartlinequantityadjustbutton/)

## Related hooks

- [`useCartLine`](/hooks/cart/usecart/)
