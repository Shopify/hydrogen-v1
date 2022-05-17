import {Suspense} from 'react';
import {Button} from '../components/Button.client';
import {SuspendedServer} from '../components/SuspendedServer.server';

export default function Home() {
  return (
    <div className="wrapper">
      <div className="hello">Hello World</div>
      <Suspense fallback="Loading...">
        <SuspendedServer />
        <Button>This does not cause a hydration error</Button>
        <p>Hi</p>
      </Suspense>
    </div>
  );
}
