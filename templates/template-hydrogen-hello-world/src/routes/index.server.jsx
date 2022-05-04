import {Suspense} from 'react';
import {SuspendedServer} from '../components/SuspendedServer.server';

export default function Home() {
  return (
    <div className="wrapper">
      <div className="hello">Hello World</div>
      <Suspense fallback="Loading...">
        <SuspendedServer />
        <p>Hi</p>
      </Suspense>
    </div>
  );
}
