import {useCart, useCartBuyerIdentityUpdateCallback} from '@shopify/hydrogen';

export function CartBuyerIdentityUpdate() {
  const {buyerIdentity} = useCart();
  const buyerIdentityUpdate = useCartBuyerIdentityUpdateCallback();
  const [cartBuyerIdentity, setCartBuyerIdentity] = useState();

  return (
    <>
      <p>Buyer’s email: {buyerIdentity.email}</p>

      <label htmlFor="email">Email:</label>
      <input
        type="text"
        name="email"
        onInput={(event) => {
          setCartBuyerIdentity({
            ...cartBuyerIdentity,
            email: event.target.value,
          });
        }}
      />
      <button
        onClick={() => {
          buyerIdentityUpdate(cartBuyerIdentity);
        }}
      >
        Update email
      </button>
    </>
  );
}
