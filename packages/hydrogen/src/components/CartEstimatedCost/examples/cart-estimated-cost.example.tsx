import {CartProvider, CartEstimatedCost} from '@shopify/hydrogen';

export default function MyCart() {
  return (
    <CartProvider>
      <CartEstimatedCost amountType="total" />
    </CartProvider>
  );
}
