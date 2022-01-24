import React, {Suspense, useState} from 'react';
// @ts-ignore
import {createRoot} from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import type {ClientHandler, ShopifyConfig} from './types';
import {ErrorBoundary} from 'react-error-boundary';
import {useServerResponse} from './framework/Hydration/rsc';
import {
  ServerStateProvider,
  ServerStateRouter,
  ShopifyProvider,
} from './client';
import {setSFAPIClient} from './foundation/useSFAPIClient';

const renderHydrogen: ClientHandler = async (
  ClientWrapper,
  {shopifyConfig}
) => {
  const root = document.getElementById('root');

  if (!root) {
    console.error(
      `Could not find a root element <div id="root"></div> to render.`
    );
    return;
  }

  setSFAPIClient(shopifyConfig);

  createRoot(root, {hydrate: true}).render(
    <ErrorBoundary FallbackComponent={Error}>
      <Suspense fallback={null}>
        <Content clientWrapper={ClientWrapper} shopifyConfig={shopifyConfig} />
      </Suspense>
    </ErrorBoundary>
  );
};

export default renderHydrogen;

function Content({
  clientWrapper: ClientWrapper,
  shopifyConfig,
}: {
  clientWrapper: any;
  shopifyConfig: ShopifyConfig;
}) {
  const [serverState, setServerState] = useState({
    pathname: window.location.pathname,
    search: window.location.search,
  });
  const response = useServerResponse(serverState);

  return (
    <ShopifyProvider shopifyConfig={shopifyConfig}>
      <ServerStateProvider
        serverState={serverState}
        setServerState={setServerState}
      >
        <BrowserRouter>
          <ServerStateRouter />
          <ClientWrapper>{response.readRoot()}</ClientWrapper>
        </BrowserRouter>
      </ServerStateProvider>
    </ShopifyProvider>
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
