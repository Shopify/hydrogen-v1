<!-- This file is generated from the source code. Edit the files in /packages/hydrogen/src/hooks/useCartBuyerIdentityUpdateCallback and run 'yarn generate-docs' at the root of this repo. -->

The `useCartBuyerIdentityUpdateCallback` hook returns a callback that can be used to update the cart's buyer identity. It must be a descendent of a `CartProvider` component.

## Example code

```tsx
import {useCart, useCartBuyerIdentityUpdateCallback} from '@shopify/hydrogen';

export function CartBuyerIdentityUpdate() {
  const {buyerIdentity} = useCart();
  const buyerIdentityUpdate = useCartBuyerIdentityUpdateCallback();
  const [cartBuyerIdentity, setCartBuyerIdentity] = useState();

  return (
    <>
      <p>Buyer’s email: {buyerIdentity.email}</p>

      <label htmlFor="email">Email:</label>
      <input
        type="text"
        name="email"
        onInput={(event) => {
          setCartBuyerIdentity({
            ...cartBuyerIdentity,
            email: event.target.value,
          });
        }}
      />
      <button
        onClick={() => {
          buyerIdentityUpdate(cartBuyerIdentity);
        }}
      >
        Update email
      </button>
    </>
  );
}
```

## Return value

A callback to update the cart's buyer identity. The callback expects one argument corresponding to an object containing the customer identity information you want to update.

## Related components

- [`CartProvider`](/api/hydrogen/components/cart/cartprovider)

## Related hooks

- [`useCart`](/api/hydrogen/hooks/cart/usecart)
