export default function () {
  return `
import renderHydrogen from '@shopify/hydrogen/entry-server';
import {DefaultRoutes} from '@shopify/hydrogen';
import {Suspense} from 'react';

import NotFound from './components/NotFound.server';
import Loading from './components/Loading';

import shopifyConfig from '../shopify.config';

function App({log, pages, ...serverState}) {
  return (
    <Suspense fallback={<Loading />}>
      <DefaultRoutes
        pages={pages}
        serverState={serverState}
        log={log}
        fallback={<NotFound />}
      />
    </Suspense>
  );
}

const pages = import.meta.globEager('./pages/**/*.server.[jt](s|sx)');
export default renderHydrogen(App, {shopifyConfig, pages});
`;
}
