import {CartProviderV2, ShopifyProvider} from '@shopify/hydrogen';

export default function NewCart() {
  return (
    <ShopifyProvider>
      <CartProviderV2 />
    </ShopifyProvider>
  );
}
