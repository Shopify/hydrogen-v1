export function AddToCart({cartId}) {
  return (
    <form action="/api/cart" method="POST">
      <input
        name="merchandiseId"
        defaultValue={btoa('gid://shopify/ProductVariant/42562624913464')}
      />
      <input type="number" name="quantity" defaultValue={2} />
      <input
        hidden
        type="checkbox"
        name="toggleSidebar"
        checked={true}
        readOnly
      />

      {/* add lines or create a cart with lines  */}
      {cartId ? (
        <>
          <input
            style={{display: 'block'}}
            name="cartId"
            defaultValue={cartId}
          />
          <button type="submit" formAction="/api/cart/linesAdd">
            Add to cart (update)
          </button>
        </>
      ) : (
        <button type="submit" formAction="/api/cart/create">
          Add to cart (create)
        </button>
      )}
    </form>
  );
}
