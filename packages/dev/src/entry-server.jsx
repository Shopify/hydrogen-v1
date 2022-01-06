import renderHydrogen from '@shopify/hydrogen/entry-server';
import {setShopifyConfig} from '@shopify/hydrogen';
import shopifyConfig from '../shopify.config';

setShopifyConfig(shopifyConfig);

import App from './App.server';

export default renderHydrogen(App, () => {
  // Custom hook
});
