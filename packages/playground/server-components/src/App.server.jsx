import {DefaultRoutes} from '@shopify/hydrogen';
import {Suspense} from 'react';

export default function App({...serverState}) {
  const pages = import.meta.globEager('./pages/**/*.server.[jt]sx');

  return (
    <Suspense fallback={'Loading...'}>
      <DefaultRoutes
        pages={pages}
        serverState={serverState}
        fallback="Not Found"
      />
    </Suspense>
  );
}
