import {ShopifyProviderClient as ShopifyProvider} from '@shopify/hydrogen';
import shopifyConfig from '../shopify.config';

export default function App({children}) {
  return (
    <ShopifyProvider shopifyConfig={shopifyConfig}>{children}</ShopifyProvider>
  );
}

export const routes = import.meta.glob('./routes/**/*.[jt](s|sx)');
