import React, {
  Suspense,
  useState,
  StrictMode,
  Fragment,
  type ElementType,
} from 'react';
// @ts-expect-error hydrateRoot isn't on the TS types yet, but we're using React 18 so it exists
import {hydrateRoot} from 'react-dom';
import type {ClientHandler} from './types';
import {ErrorBoundary} from 'react-error-boundary';
import {useServerResponse} from './framework/Hydration/rsc';
import {ServerStateProvider} from './foundation/ServerStateProvider';
import {Router} from './foundation/Router/Router';

const renderHydrogen: ClientHandler = async (ClientWrapper, config) => {
  const root = document.getElementById('root');

  if (!root) {
    console.error(
      `Could not find a root element <div id="root"></div> to render.`
    );
    return;
  }

  // default to StrictMode on, unless explicitly turned off
  const RootComponent = config?.strictMode !== false ? StrictMode : Fragment;

  hydrateRoot(
    root,
    <RootComponent>
      <ErrorBoundary FallbackComponent={Error}>
        <Suspense fallback={null}>
          <Content clientWrapper={ClientWrapper} />
        </Suspense>
      </ErrorBoundary>
    </RootComponent>
  );
};

export default renderHydrogen;

function Content({
  clientWrapper: ClientWrapper = ({children}: {children: JSX.Element}) =>
    children,
}: {
  clientWrapper: ElementType;
}) {
  const [serverState, setServerState] = useState({
    pathname: window.location.pathname,
    search: window.location.search,
  });
  const response = useServerResponse(serverState);

  return (
    <ServerStateProvider
      serverState={serverState}
      setServerState={setServerState}
    >
      <Router>
        <ClientWrapper>{response.readRoot()}</ClientWrapper>
      </Router>
    </ServerStateProvider>
  );
}

function Error({error}: {error: Error}) {
  if (import.meta.env.DEV) {
    return (
      <div style={{padding: '1em'}}>
        <h1 style={{fontSize: '2em', marginBottom: '1em', fontWeight: 'bold'}}>
          Error
        </h1>

        <pre style={{whiteSpace: 'pre-wrap'}}>{error.stack}</pre>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: '2em',
        textAlign: 'center',
      }}
    >
      <h1 style={{fontSize: '2em', marginBottom: '1em', fontWeight: 'bold'}}>
        Something's wrong here...
      </h1>

      <div style={{fontSize: '1.1em'}}>
        <p>We found an error while loading this page.</p>
        <p>
          Please, refresh or go back to the{' '}
          <a href="/" style={{textDecoration: 'underline'}}>
            home page
          </a>
          .
        </p>
      </div>
    </div>
  );
}
