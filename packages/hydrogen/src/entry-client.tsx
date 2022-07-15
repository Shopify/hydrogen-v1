import React, {
  Suspense,
  useState,
  StrictMode,
  Fragment,
  type ElementType,
} from 'react';
import {hydrateRoot} from 'react-dom/client';
import type {ClientConfig, ClientHandler} from './types.js';
import {ErrorBoundary} from 'react-error-boundary';
import {
  createFromFetch,
  createFromReadableStream,
  // @ts-ignore
} from '@shopify/hydrogen/vendor/react-server-dom-vite';
import {RSC_PATHNAME} from './constants.js';
import {ServerPropsProvider} from './foundation/ServerPropsProvider/index.js';
import type {DevServerMessage} from './utilities/devtools.js';
import type {LocationServerProps} from './foundation/ServerPropsProvider/ServerPropsProvider.js';
import {ClientAnalytics} from './foundation/Analytics/index.js';

let rscReader: ReadableStream | null;

const cache = new Map();

// Hydrate an SSR response from <meta> tags placed in the DOM.
const flightChunks: string[] = [];
const FLIGHT_ATTRIBUTE = 'data-flight';

function addElementToFlightChunks(el: Element) {
  // We don't need to decode, because `.getAttribute` already decodes
  const chunk = el.getAttribute(FLIGHT_ATTRIBUTE);
  if (chunk) {
    flightChunks.push(chunk);
  }
}

// Get initial payload
document
  .querySelectorAll('[' + FLIGHT_ATTRIBUTE + ']')
  .forEach(addElementToFlightChunks);

// Create a mutation observer on the document to detect when new
// <meta data-flight> tags are added, and add them to the array.
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (
        node instanceof HTMLElement &&
        node.tagName === 'META' &&
        node.hasAttribute(FLIGHT_ATTRIBUTE)
      ) {
        addElementToFlightChunks(node);
      }
    });
  });
});

observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
});

if (flightChunks.length > 0) {
  const contentLoaded = new Promise((resolve) =>
    document.addEventListener('DOMContentLoaded', resolve)
  );

  try {
    rscReader = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        const write = (chunk: string) => {
          controller.enqueue(encoder.encode(chunk));
          return 0;
        };

        flightChunks.forEach(write);
        flightChunks.push = write;

        contentLoaded.then(() => {
          controller.close();
          observer.disconnect();
        });
      },
    });
  } catch (_) {
    // Old browser, will try a new hydration request later
  }
}

const renderHydrogen: ClientHandler = async (ClientWrapper) => {
  const root = document.getElementById('root');

  if (!root) {
    console.error(
      `Could not find a root element <div id="root"></div> to render.`
    );
    return;
  }

  if (import.meta.hot) {
    import.meta.hot.on(
      'hydrogen-browser-console',
      ({type, data}: DevServerMessage) => {
        if (type === 'warn') {
          console.warn(data);
        }
      }
    );
  }

  let config: ClientConfig;
  try {
    config = JSON.parse(root.dataset.clientConfig ?? '{}');
  } catch (error: any) {
    config = {};
    if (__HYDROGEN_DEV__) {
      console.warn(
        'Could not parse client configuration in browser',
        error.message
      );
    }
  }

  const RootComponent =
    // Default to StrictMode on, unless explicitly turned off
    config.strictMode !== false ? StrictMode : Fragment;

  // Fixes hydration in `useId`: https://github.com/Shopify/hydrogen/issues/1589
  const ServerRequestProviderMock = () => null;

  hydrateRoot(
    root,
    <RootComponent>
      <ServerRequestProviderMock />
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
  const [serverProps, setServerProps] = useState<LocationServerProps>({
    pathname: window.location.pathname,
    search: window.location.search,
  });
  const response = useServerResponse(serverProps);

  return (
    <ServerPropsProvider
      initialServerProps={serverProps}
      setServerPropsForRsc={setServerProps}
    >
      <ClientWrapper>{response.readRoot()}</ClientWrapper>
    </ServerPropsProvider>
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
        Something&apos;s wrong here...
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

function useServerResponse(state: any) {
  const key = JSON.stringify(state);

  let response = cache.get(key);
  if (response) {
    return response;
  }

  if (rscReader) {
    // The flight response was inlined during SSR, use it directly.
    response = createFromReadableStream(rscReader);
    rscReader = null;
  } else {
    if (
      /* @ts-ignore */
      window.BOOMR &&
      /* @ts-ignore */
      window.BOOMR.plugins &&
      /* @ts-ignore */
      window.BOOMR.plugins.Hydrogen
    ) {
      /* @ts-ignore */
      window.BOOMR.plugins.Hydrogen.trackSubPageLoadPerformance();
    }

    ClientAnalytics.resetPageAnalyticsData();

    // Request a new flight response.
    response = createFromFetch(
      fetch(`${RSC_PATHNAME}?state=` + encodeURIComponent(key))
    );
  }

  cache.clear();
  cache.set(key, response);
  return response;
}
