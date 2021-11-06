<!-- This file is generated from the source code. Edit the files in /packages/hydrogen/src/components/CartLines and run 'yarn generate-docs' at the root of this repo. -->

The `CartLines` component iterates over each cart line and renders its `children` within
a `CartLineProvider` for each cart line. It also provides render props in the case where `children` is a function.

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

| Name     | Type                                                                | Description                                                                                                             |
| -------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| as?      | <code>"ul"</code>                                                   | A `ReactNode` element. Valid values: `ul` or `undefined`. If `ul`, then each child will be wrapped with a `li` element. |
| children | <code>ReactNode &#124; (line: UndocumentedType) => ReactNode</code> | A `ReactNode` element or a function that takes a cart line as an argument and returns a `ReactNode`.                    |

## Component type

The `CartLines` component is a shared component, which means that it renders on both the server and the client. For more information about component types, refer to [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components).

## Related components

- [`CartLineAttributes`](/api/hydrogen/components/cart/cartlineattributes)
- [`CartLineImage`](/api/hydrogen/components/cart/cartlineimage)
- [`CartLinePrice`](/api/hydrogen/components/cart/cartlineprice)
- [`CartLineProvider`](/api/hydrogen/components/cart/cartlineprovider)
- [`CartLineProductTitle`](/api/hydrogen/components/cart/cartlineproducttitle)
- [`CartLineQuantity`](/api/hydrogen/components/cart/cartlinequantity)
- [`CartLineQuantityAdjustButton`](/api/hydrogen/components/cart/cartlinequantityadjustbutton)
- [`CartLineSelectedOptions`](/api/hydrogen/components/cart/cartlineselectedoptions)

## Related hooks

- [`useCartLine`](/api/hydrogen/hooks/cart/usecart)
