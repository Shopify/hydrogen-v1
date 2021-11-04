import {CartProvider, useCart} from '@shopify/hydrogen';

export function MyComponent() {
  return (
    <CartProvider>
      <CartLineItems />
    </CartProvider>
  )
}

export function CartLineItems() {
  const {lines} = useCart();

  return (
    <>
      {lines.map((line) => {
        return {/* your JSX*/}
      })}
    </>
  )
}
