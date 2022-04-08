import React, {
  Suspense,
  useState,
  StrictMode,
  Fragment,
  type ElementType,
} from 'react';
import {hydrateRoot} from 'react-dom/client';
import type {ClientHandler} from './types';
import {ErrorBoundary} from 'react-error-boundary';
import {useServerResponse} from './framework/Hydration/rsc';
import {ServerStateProvider} from './foundation/ServerStateProvider';
import type {DevServerMessage} from './utilities/devtools';

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

  // default to StrictMode on, unless explicitly turned off
  const RootComponent = config?.strictMode !== false ? StrictMode : Fragment;

  let hasCaughtError = false;

  hydrateRoot(
    root,
    <>
      <RootComponent>
        <ErrorBoundary FallbackComponent={Error}>
          <Suspense fallback={null}>
            <Content clientWrapper={ClientWrapper} />
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
      <ClientWrapper>{response.readRoot()}</ClientWrapper>
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
