import React, {Suspense, useState, StrictMode, Fragment} from 'react';
// @ts-expect-error hydrateRoot isn't on the TS types yet, but we're using React 18 so it exists
import {hydrateRoot} from 'react-dom/client';
import type {ClientHandler, HydrogenManifest} from './types';
import {ErrorBoundary} from 'react-error-boundary';
import {useServerResponse} from './framework/Hydration/rsc';
import {ServerStateProvider} from './foundation/ServerStateProvider';
import type {DevServerMessage} from './utilities/devtools';
import {matchPath} from './utilities/matchPath';

const DevTools = React.lazy(() => import('./components/DevTools'));

const renderHydrogen: ClientHandler = async (ClientWrapper, config) => {
  const root = document.getElementById('root');

  if (!root) {
    console.error(
      `Could not find a root element <div id="root"></div> to render.`
    );
    return;
  }

  if (import.meta.hot) {
    import.meta.hot.on('hydrogen', ({type, data}: DevServerMessage) => {
      if (type === 'warn') {
        console.warn(data);
      }
    });
  }

  // @ts-ignore
  const manifest = window.__hydrogenManifest as HydrogenManifest;

  // default to StrictMode on, unless explicitly turned off
  const RootComponent = config?.strictMode !== false ? StrictMode : Fragment;

  let hasCaughtError = false;

  hydrateRoot(
    root,
    <>
      <RootComponent>
        <ErrorBoundary FallbackComponent={Error}>
          <Suspense fallback={null}>
            <Content manifest={manifest} />
          </Suspense>
        </ErrorBoundary>
      </RootComponent>
      {typeof DevTools !== 'undefined' && config?.showDevTools ? (
        <DevTools />
      ) : null}
    </>,
    {
      onRecoverableError(e: any) {
        if (__DEV__ && !hasCaughtError) {
          hasCaughtError = true;
          console.log(
            `React encountered an error while attempting to hydrate the application. ` +
              `This is likely due to a bug in React's Suspense behavior related to experimental server components, ` +
              `and it is safe to ignore this error.\n` +
              `Visit this issue to learn more: https://github.com/Shopify/hydrogen/issues/920.\n\n` +
              `The original error is printed below:`
          );
          console.log(e);
        }
      },
    }
  );
};

export default renderHydrogen;

function Content({manifest}: {manifest: HydrogenManifest}) {
  // Find matching routes (and their parents)
  const matches = [];

  for (const path in manifest.routes) {
    const route = manifest.routes[path];
    let match;
    if ((match = matchPath(window.location.pathname, route))) {
      matches.push(match);
    }
  }

  // This is the root which always renders, no matter what
  matches.push(manifest.routes.App);

  // <OutletContext.Provider value={<MatchContent />}>
  //   <AppContent />
  // </OutletContext.Provider>

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
      {response.readRoot()}
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
