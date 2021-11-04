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
