import {useCart} from '../useCart';

/**
 * The `useCartNoteUpdateCallback` hook returns a callback that can be used to update the cart's note. It must be a descendent of a `CartProvider` component.
 */
export function useCartNoteUpdateCallback() {
  const {noteUpdate} = useCart();

  return noteUpdate;
}
