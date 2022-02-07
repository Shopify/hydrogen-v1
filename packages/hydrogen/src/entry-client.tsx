import React, {Suspense, useState} from 'react';
// @ts-ignore
import {hydrateRoot} from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import type {ClientHandler} from './types';
import {ErrorBoundary} from 'react-error-boundary';
import {useServerResponse} from './framework/Hydration/rsc';
import {ServerStateProvider, ServerStateRouter} from './client';

const renderHydrogen: ClientHandler = async (ClientWrapper) => {
  const root = document.getElementById('root');

  if (!root) {
    console.error(
      `Could not find a root element <div id="root"></div> to render.`
    );
    return;
  }

  hydrateRoot(
    root,
    <ErrorBoundary FallbackComponent={Error}>
      <Suspense fallback={null}>
        <Content clientWrapper={ClientWrapper} />
      </Suspense>
    </ErrorBoundary>
  );
};

export default renderHydrogen;

function Content({
  clientWrapper: ClientWrapper = ({children}: any) => children,
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
      <BrowserRouter>
        <ServerStateRouter />
        <ClientWrapper>{response.readRoot()}</ClientWrapper>
      </BrowserRouter>
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
