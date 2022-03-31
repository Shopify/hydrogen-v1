import renderHydrogen from '@shopify/hydrogen/entry-server';
import {FileRoutes, Router, ShopifyProvider} from '@shopify/hydrogen';
import shopifyConfig from '../shopify.config';

function App() {
  return (
    <ShopifyProvider shopifyConfig={shopifyConfig}>
      <Router>
        <FileRoutes route={routes} />
      </Router>
    </ShopifyProvider>
  );
}

const routes = import.meta.globEager('./routes/**/*.server.[jt](s|sx)');

export default renderHydrogen(App, {routes, shopifyConfig});
