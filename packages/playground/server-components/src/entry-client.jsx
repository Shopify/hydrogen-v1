import renderHydrogen from '@shopify/hydrogen/entry-client';
import shopifyConfig from '../shopify.config';
import {setShopifyConfig} from '@shopify/hydrogen/client';

setShopifyConfig(shopifyConfig);

function ClientApp({children}) {
  return children;
}

export default renderHydrogen(ClientApp);
