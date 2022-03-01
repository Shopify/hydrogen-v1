export default function () {
  return `
import renderHydrogen from '@shopify/hydrogen/entry-server';
import {Router, DefaultRoutes, ShopifyProvider} from '@shopify/hydrogen';
import {Suspense} from 'react';

import NotFound from './components/NotFound.server';
import Loading from './components/Loading';

import shopifyConfig from '../shopify.config';

function App({routes, ...serverState}) {
  return (
    <Suspense fallback={<Loading />}>
      <ShopifyProvider shopifyConfig={shopifyConfig}>
        <Router fallback={<NotFound />} serverState={serverState}>
          <DefaultRoutes routes={routes} />
        </Router>
      <ShopifyProvider />
    </Suspense>
  );
}

const routes = import.meta.globEager('./routes/**/*.server.[jt](s|sx)');
export default renderHydrogen(App, {routes});
`;
}
