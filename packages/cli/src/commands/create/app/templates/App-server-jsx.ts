export default function () {
  return `
import {DefaultRoutes} from '@shopify/hydrogen';
import {Suspense} from 'react';

import NotFound from './components/NotFound.server';
import Loading from './components/Loading';

export default function App({log, pages, ...serverState}) {
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
`;
}
