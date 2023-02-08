# CartCost


The `CartCost` component renders a `Money` component with the
cost associated with the `amountType` prop. If no `amountType` prop is specified, then it defaults to `totalAmount`.

## Example code

```tsx
import {CartProvider, CartCost} from '@shopify/hydrogen';

export default function MyCart() {
  return (
    <CartProvider>
      <CartCost amountType="total" />
    </CartProvider>
  );
}
```

## Props

| Name        | Type                                                              | Description                                                                                              |
| ----------- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| amountType? | <code>"total" &#124; "subtotal" &#124; "tax" &#124; "duty"</code> | A string type that defines the type of cost needed. Valid values: `total`, `subtotal`, `tax`, or `duty`. |
| children?   | <code>React.ReactNode</code>                                      | A function that takes an object return by the `useMoney` hook and returns a `ReactNode`.                 |

## Component type

The `CartCost` component is a client component, which means that it renders on the client.
For more information about component types, refer to [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/react-server-components).

## Related components

- [`Money`](/docs/components/primitive/money.md)

## Related hooks

- [`useCart`](/docs/hooks/cart/usecart.md)
