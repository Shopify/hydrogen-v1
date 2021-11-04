import {CartLineProvider, useCart, CartLinePrice} from '@shopify/hydrogen';

export function App() {
  const {lines} = useCart();

  return lines.map((line) => {
    return (
      <CartLineProvider key={line.id} line={line}>
        <CartLinePrice priceType="compareAt" />
      </CartLineProvider>
    )
  });
}
