import App from './App.server';
import renderHydrogen from '@shopify/hydrogen/entry-server';
import {setLogger, setShopifyConfig} from '@shopify/hydrogen';
import shopifyConfig from '../shopify.config';

setShopifyConfig(shopifyConfig);

setLogger({
  trace() {},
  debug() {},
  warn(context, ...args) {
    console.warn(...args);
  },
  error(context, ...args) {
    console.error(...args);
  },
  fatal(context, ...args) {
    console.error(...args);
  },
});

export default renderHydrogen(App, ({url}) => {
  // Custom hook
});
