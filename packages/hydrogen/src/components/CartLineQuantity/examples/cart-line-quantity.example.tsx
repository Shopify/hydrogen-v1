import {CartLineProvider, useCart, CartLineQuantity} from '@shopify/hydrogen';

export function App() {
  const {lines} = useCart();

  return lines.map((line) => {
    return (
      <CartLineProvider key={line.id} line={line}>
        <CartLineQuantity />
      </CartLineProvider>
    );
  });
}
