# useCartLine


The `useCartLine` hook provides access to the cart line object. It must be a descendent of a `CartProvider` component.

## Example code

```tsx
import {
  CartLinePrice,
  CartLineProvider,
  useCartLine,
  useCart,
} from '@shopify/hydrogen';

export function MyComponent() {
  const {lines} = useCart();

  return lines.map((line) => {
    return (
      <CartLineProvider>
        <CartLineItem />
      </CartLineProvider>
    );
  });
}

export function CartLineItem() {
  const {
    quantity,
    merchandise: {
      product: { title },
    },
  } = useCartLine();

  return (
    <>
      <h2>{title}</h2>
      <span>{quantity}</span>
      <CartLinePrice as="span" />
    </>
  );
}
```

## Return value

The `useCartLine` hook returns an object with the following keys:

| Name          | Description                             |
| ------------- | --------------------------------------- |
| `id`          | The cart line's ID.                     |
| `quantity`    | The cart line's quantity.               |
| `attributes`  | The cart line's [attributes](https://shopify.dev/api/storefront/latest/objects/cartline#field-cartline-attributes).             |
| `merchandise` | The cart line's associated [merchandise](https://shopify.dev/api/storefront/latest/objects/cartline#field-cartline-merchandise). |

## Related components

- [`CartLineProvider`](/components/cart/cartprovider/)
