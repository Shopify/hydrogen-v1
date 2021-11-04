import {useCartLinesUpdateCallback} from '@shopify/hydrogen';

export function CustomAdjustQuantityButton({lineId, newQuantity}) {
  const updateLines = useCartLinesUpdateCallback();

  return (
    <button
      onClick={() => {
        updateLines([{
          id: lineId,
          quantity: newQuantity,
        }])
      }}
    >
      +
    </button>
  );
}
