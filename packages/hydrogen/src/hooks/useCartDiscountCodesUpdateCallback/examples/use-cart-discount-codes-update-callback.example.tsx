import {useCartDiscountCodesUpdateCallback} from '@shopify/hydrogen';

export function CartDiscountCodeUpdate() {
  const updateDiscountCodes = useCartDiscountCodesUpdateCallback();
  const [discountCode, setDiscountCode] = useState();

  return (
    <>
      <input
        type="text"
        placeholder="Discount code"
        onChange={(event) => {
          setDiscountCode(event.target.value);
        }}
      />
      <button
        onClick={() => {
          updateDiscountCodes([discountCode]);
        }}
      >
        Apply
      </button>
    </>
  );
}
