import renderHydrogen from '@shopify/hydrogen/entry-client';
import {ShopifyProvider, setShopifyConfig} from '@shopify/hydrogen/client';

import shopifyConfig from '../shopify.config';

setShopifyConfig(shopifyConfig);

function ClientApp({children}) {
  return children;
}

export default renderHydrogen(ClientApp);
