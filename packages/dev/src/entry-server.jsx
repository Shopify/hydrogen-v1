import renderHydrogen from '@shopify/hydrogen/entry-server';
import shopifyConfig from '../shopify.config';

import App from './App.server';

export default renderHydrogen(App, {shopifyConfig});
