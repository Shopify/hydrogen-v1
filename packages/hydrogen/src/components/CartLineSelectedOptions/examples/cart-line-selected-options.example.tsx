import {
  CartLineProvider,
  useCart,
  CartLineSelectedOptions,
} from '@shopify/hydrogen';

export function App() {
  const {lines} = useCart();

  return lines.map((line) => {
    return (
      <CartLineProvider key={line.id} line={line}>
        <CartLineSelectedOptions>
          {({name, value}) => (
            <>
              {name}: {value}
            </>
          )}
        </CartLineSelectedOptions>
      </CartLineProvider>
    );
  });
}
