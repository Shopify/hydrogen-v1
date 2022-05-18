import {Suspense} from 'react';
import {Button} from '../components/Button.client';
import {SuspendedServer} from '../components/SuspendedServer.server';

export default function Home() {
  return (
    <div className="wrapper">
      <div className="hello">Hello World</div>
      <Suspense fallback="Loading...">
        <SuspendedServer />
        {/* No hydration error, because flight stream contains ref to client component before suspending,
            and the browser has time to load it. */}
        <Button>This does not cause a hydration error</Button>
        <p>Plain text</p>
      </Suspense>
    </div>
  );
}
