import {DefaultRoutes} from '@shopify/hydrogen';
import {Suspense} from 'react';

import DefaultSeo from './components/DefaultSeo.server';
import NotFound from './components/NotFound.server';
import AppClient from './App.client';
import LoadingFallback from './components/LoadingFallback';

export default function App({...serverState}) {
  const pages = import.meta.globEager('./pages/**/*.server.[jt]sx');

  return (
    <Suspense fallback={<LoadingFallback />}>
      <AppClient helmetContext={serverState.helmetContext}>
        <DefaultSeo />
        <DefaultRoutes
          pages={pages}
          serverState={serverState}
          fallback={<NotFound />}
        />
      </AppClient>
    </Suspense>
  );
}
