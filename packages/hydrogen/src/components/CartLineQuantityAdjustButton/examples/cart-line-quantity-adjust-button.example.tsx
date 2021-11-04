import {CartLineProvider, useCart, CartLineQuantityAdjustButton} from '@shopify/hydrogen';

export function App() {
  const {lines} = useCart();

  return lines.map((line) => {
    return (
      <CartLineProvider key={line.id} line={line}>
        <CartLineQuantityAdjustButton adjust="increase">Increase quantity</CartLineQuantityAdjustButton>
        <CartLineQuantityAdjustButton adjust="decrease">Decrease quantity</CartLineQuantityAdjustButton>
        <CartLineQuantityAdjustButton adjust="remove">Remove from cart</CartLineQuantityAdjustButton>
      </CartLineProvider>
    )
  });
}
