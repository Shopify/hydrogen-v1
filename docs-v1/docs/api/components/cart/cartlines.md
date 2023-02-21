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

- [`CartLineImage`](/docs/components/cart/cartlineimage.md)
- [`CartLinePrice`](/docs/components/cart/cartlineprice.md)
- [`CartLineProvider`](/docs/components/cart/cartlineprovider.md)
- [`CartLineProductTitle`](/docs/components/cart/cartlineproducttitle.md)
- [`CartLineQuantity`](/docs/components/cart/cartlinequantity.md)
- [`CartLineQuantityAdjustButton`](/docs/components/cart/cartlinequantityadjustbutton.md)

## Related hooks

- [`useCartLine`](/docs/hooks/cart/usecart.md)
