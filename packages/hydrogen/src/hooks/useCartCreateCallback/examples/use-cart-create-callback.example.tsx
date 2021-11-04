import {useCartCreateCallback} from '@shopify/hydrogen';

export function CustomAddToCartButton() {
  const createCart = useCartCreateCallback();

  return (
    <button
      onClick={() => {
        // if no cart exists, create it
        createCart({
          lines: [{
            quantity: 1,
            merchandiseId: '1234',
          }]
        })
      }}
    >
      Add to cart
    </button>
  );
}
