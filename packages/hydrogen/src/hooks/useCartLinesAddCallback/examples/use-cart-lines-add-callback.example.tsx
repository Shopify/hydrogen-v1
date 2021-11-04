import {useCartLinesAddCallback} from '@shopify/hydrogen';

export function CustomAddToCartButton() {
  const addLines = useCartLinesAddCallback();

  return (
    <button
      onClick={() => {
        addLines([{
          quantity: 1,
          merchandiseId: '1234',
        }])
      }}
    >
      Add to cart
    </button>
  );
}
