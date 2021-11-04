<!-- This file is generated from the source code. Edit the files in /packages/hydrogen/src/hooks/useCartNoteUpdateCallback and run 'yarn generate-docs' at the root of this repo. -->

The `useCartNoteUpdateCallback` hook returns a callback that can be used to update the cart's note. It must be a descendent of a `CartProvider` component.

## Example code

```tsx
import {useCart, useCartNoteUpdateCallback} from '@shopify/hydrogen';

export function CartNoteUpdate() {
  const {note} = useCart();
  const noteUpdate = useCartNoteUpdateCallback();
  const [cartNote, setCartNote] = useState();

  return (
    <>
      <p>{note}</p>
      <textarea
        onInput={(event) => {
          setCartNote(event.target.value);
        }}
      ></textarea>
      <button
        onClick={() => {
          noteUpdate(cartNote);
        }}
      >
        Update note
      </button>
    </>
  );
}
```

## Return value

A callback to update the cart's note. The callback expects one argument corresponding to the value of the note you want to update.

## Related components

- [`CartProvider`](/api/hydrogen/components/cart/cartprovider)

## Related hooks

- [`useCart`](/api/hydrogen/hooks/cart/usecart)
