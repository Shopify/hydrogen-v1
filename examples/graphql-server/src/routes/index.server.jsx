import {Suspense} from 'react';

import Greeting from '../components/Greeting.client';

export default function Page() {
  return (
    <Suspense fallback="loading...">
      <Greeting />
    </Suspense>
  );
}
