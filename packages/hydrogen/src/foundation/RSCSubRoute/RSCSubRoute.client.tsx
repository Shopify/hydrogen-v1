import React, {
  useEffect,
  useState,
  ReactElement,
  useTransition,
  Suspense,
} from 'react';
import {ErrorBoundary} from 'react-error-boundary';
import {
  createFromFetch,
  // @ts-ignore
} from '@shopify/hydrogen/vendor/react-server-dom-vite';
import {RSC_PATHNAME} from '../../constants';

type RSCSubRouteClientProps = {
  /** The state of this RSC route */
  state: any;
  isRSC: boolean;
  children?: ReactElement;
};

const DEFAULT_MAX_AGE = 1000;
const cache = new Map();

export function RSCSubRouteClient({
  state,
  isRSC,
  children,
}: RSCSubRouteClientProps) {
  const [isPending, startTransition] = useTransition();
  const [response, setResponse] = useState(<Suspense>{children}</Suspense>);

  useEffect(() => {
    if (isRSC) {
      startTransition(() => {
        setResponse(getSubServerResponse(state));
      });
    }
  }, [state, isRSC, response]);

  return (
    <ErrorBoundary
      fallbackRender={() => {
        return null;
      }}
    >
      <div className={isPending ? 'opacity-50' : ''}>
        {/* @ts-ignore */}
        {response && response.readRoot ? response.readRoot() : response}
      </div>
    </ErrorBoundary>
  );
}

function getSubServerResponse(state: any) {
  const key = JSON.stringify(state);

  const cacheEntry = cache.get(key);
  if (cacheEntry && Date.now() < cacheEntry.expiry) {
    return cacheEntry.response;
  }

  console.log(`${RSC_PATHNAME}?state=` + encodeURIComponent(key));

  const response = createFromFetch(
    fetch(`${RSC_PATHNAME}?state=` + encodeURIComponent(key)).then((res) => {
      let maxAge: number = DEFAULT_MAX_AGE;
      const cacheControl = res.headers.get('cache-control');

      if (cacheControl) {
        const maxAgeMatch = cacheControl.match(/max-age=(\d*)/);
        if (maxAgeMatch) {
          try {
            maxAge = parseInt(maxAgeMatch[1]) * 1000;
          } catch {
            maxAge = DEFAULT_MAX_AGE;
          }
        }
      }

      mergeCacheEntry(key, {
        expiry:
          Math.floor(res.status / 100) === 2
            ? Date.now() + maxAge
            : DEFAULT_MAX_AGE,
      });

      return res;
    })
  );

  mergeCacheEntry(key, {
    response,
  });

  return response;
}

function mergeCacheEntry(key: string, data: any) {
  const cachedData = cache.get(key);
  cache.set(key, {
    ...cachedData,
    ...data,
  });
}
