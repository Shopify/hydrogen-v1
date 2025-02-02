import {useSession} from '@shopify/hydrogen';

export function AddToCart({id, variant}) {
  const {cartId} = useSession();
  return (
    <form
      id={id}
      method="POST"
      style={{display: 'flex', flexDirection: 'column'}}
    >
      {/* hidden info fields needed by the cart api */}
      <input hidden type="text" name="cartId" defaultValue={cartId} />
      <input
        hidden
        type="checkbox"
        readOnly
        name="toggleSidebar"
        checked={true}
      />
      <input
        hidden
        type="text"
        name="merchandiseId"
        defaultValue={btoa(variant.id)}
      />

      <div style={{display: 'flex', gap: '0rem 1.5rem'}}>
        {/*
          if no cart is available, we create it with the line item,
          else we update it with the new item
        */}
        <button
          type="submit"
          formAction={cartId ? '/api/cart/linesAdd' : '/api/cart/create'}
          disabled={!variant.availableForSale}
        >
          Add To Cart
        </button>

        <input
          type="number"
          name="quantity"
          defaultValue={1}
          style={{width: '40px'}}
        />
      </div>
    </form>
  );
}
