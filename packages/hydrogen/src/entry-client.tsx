import React, {Suspense, useState} from 'react';
// @ts-ignore
import {createRoot} from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import type {ClientHandler} from './types';
import {ErrorBoundary} from 'react-error-boundary';
import {HelmetProvider} from 'react-helmet-async';
import {useServerResponse} from './framework/Hydration/Cache.client';
import {ServerStateProvider, ServerStateRouter} from './client';
import {QueryProvider} from './hooks';

const renderHydrogen: ClientHandler = async (ClientWrapper) => {
  const root = document.getElementById('root');

  if (!root) {
    console.error(
      `Could not find a root element <div id="root"></div> to render.`
    );
    return;
  }

  createRoot(root, {hydrate: true}).render(
    <ErrorBoundary FallbackComponent={Error}>
      <Suspense fallback={null}>
        <Content clientWrapper={ClientWrapper} />
      </Suspense>
    </ErrorBoundary>
  );
};

export default renderHydrogen;

function Content({clientWrapper: ClientWrapper}: {clientWrapper: any}) {
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
      <QueryProvider>
        <HelmetProvider>
          <BrowserRouter>
            <ServerStateRouter />
            {/* @ts-ignore */}
            <ClientWrapper>{response.read()}</ClientWrapper>
          </BrowserRouter>
        </HelmetProvider>
      </QueryProvider>
    </ServerStateProvider>
  );
}

function Error({error}: {error: Error}) {
  return (
    <div style={{padding: '1em'}}>
      <h1 style={{fontSize: '2em', marginBottom: '1em', fontWeight: 'bold'}}>
        Error
      </h1>
      <pre style={{whiteSpace: 'pre-wrap'}}>{error.stack}</pre>
    </div>
  );
}
