import renderHydrogen from '@shopify/hydrogen/entry-server';
import {DefaultRoutes, ShopifyProvider} from '@shopify/hydrogen';
import {Suspense} from 'react';
import shopifyConfig from '../shopify.config';
import DefaultSeo from './components/DefaultSeo.server';
import NotFound from './components/NotFound.server';
import LoadingFallback from './components/LoadingFallback';
import CartProvider from './components/CartProvider.client';

let redirects;

function App({log, pages, ...serverState}) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ShopifyProvider shopifyConfig={shopifyConfig}>
        <CartProvider>
          <DefaultSeo />
          <DefaultRoutes
            pages={pages}
            serverState={serverState}
            log={log}
            fallback={<NotFound />}
          />
          {redirects.map((redirect) => (
            <div key={redirect.from}>{redirect.from}</div>
          ))}
        </CartProvider>
      </ShopifyProvider>
    </Suspense>
  );
}

const pages = import.meta.globEager('./pages/**/*.server.[jt](s|sx)');

function getRoutes() {
  return new Promise(
    (resolve) =>
      resolve([
        {from: 'old', to: 'new'},
        {from: 'old-1', to: 'new-1'},
        {from: 'old-2', to: 'new-2'},
      ]),
    1000,
  );
}

export default async function () {
  if (!redirects) {
    redirects = await getRoutes();
  }

  return renderHydrogen(App, {pages});
}
