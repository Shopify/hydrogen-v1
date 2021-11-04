import {ShopPayButton} from '@shopify/hydrogen';

export function MyProduct({variantId}) {
  return <ShopPayButton variantIds={[variantId]} />;
}
