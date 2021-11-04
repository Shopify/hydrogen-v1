import {CartLineProvider, useCartLine, useCart} from '@shopify/hydrogen';

export function MyComponent() {
  const {lines} = useCart();

  return lines.map((line) => {
    return (
      <CartLineProvider>
        <CartLineItem />
      </CartLineProvider>
    );
  })
}

export function CartLineItem() {
  const {price, productTitle, quantity} = useCartLine();

  return (
    <>
      <h2>{productTitle}</h2>
      <span>{price}</span>
      <span>{quantity}</span>
    </>
  )
}
