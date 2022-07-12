import {useSession, flattenConnection} from '@shopify/hydrogen';

export function CartLines({lines = []}) {
  return (
    <div>
      <hr />
      <div
        style={{
          padding: '.5rem 1rem',
          height: 'calc(100vh - 100px)',
          overflowY: 'scroll',
        }}
      >
        {/* each line items */}
        {lines?.length ? (
          (lines || []).map((line) => {
            return <CartLine key={line.id} {...line} />;
          })
        ) : (
          <p>No items in cart</p>
        )}
      </div>
    </div>
  );
}

function CartLine({id, merchandise, quantity}) {
  const [image] = flattenConnection(merchandise.product.images);
  const {cartId} = useSession();
  return (
    <div key={id}>
      {image?.thumb ? <img src={image.thumb} width={100} /> : null}
      <p style={{marginTop: 0, marginBottom: 0}}>{merchandise.product.title}</p>
      <small>{merchandise.title}</small>

      <form method="POST">
        {/* hidden info fields needed by the cart api */}
        <input hidden name="cartId" defaultValue={cartId} />
        <input
          hidden
          type="checkbox"
          name="toggleSidebar"
          checked={false}
          readOnly
        />
        <input
          type="text"
          hidden
          name="lineIds"
          defaultValue={JSON.stringify([id])}
        />

        <div
          style={{
            marginBottom: '1rem',
            paddingBottom: '1rem',
            display: 'flex',
            borderBottom: '1px solid white',
          }}
        >
          <input
            type="number"
            name="quantity"
            defaultValue={quantity}
            style={{width: '40px'}}
          />
          <button type="submit" formAction="/api/cart/linesRemove">
            Remove
          </button>
        </div>
      </form>
    </div>
  );
}
