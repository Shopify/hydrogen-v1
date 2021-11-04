import {CartLineProvider, useCart, CartLineAttributes} from '@shopify/hydrogen';

export function App() {
  const {lines} = useCart();

  return lines.map((line) => {
    return (
      <CartLineProvider key={line.id} line={line}>
        <CartLineAttributes>
          {({key, value}) => (
            <>
              {key}: {value}
            </>
          )}
        </CartLineAttributes>
      </CartLineProvider>
    )
  });
}
