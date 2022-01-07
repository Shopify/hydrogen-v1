import {useCartLinesRemoveCallback} from '@shopify/hydrogen';

export function RemoveFromCartButton({lineId}) {
  const removeLines = useCartLinesRemoveCallback();

  return (
    <button
      onClick={() => {
        removeLines([lineId]);
      }}
    >
      Remove from cart
    </button>
  );
}
