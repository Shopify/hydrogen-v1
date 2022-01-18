import renderHydrogen from '@shopify/hydrogen/entry-client';
import shopifyConfig from '../shopify.config';

function ClientApp({children}) {
  return children;
}

export default renderHydrogen(ClientApp, {shopifyConfig});
