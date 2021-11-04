import {CartLineProvider, useCart, CartLineProductTitle} from '@shopify/hydrogen';

export function App() {
  const {lines} = useCart();

  return lines.map((line) => {
    return (
      <CartLineProvider key={line.id} line={line}>
        <CartLineProductTitle />
      </CartLineProvider>
    )
  });
}
