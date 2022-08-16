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
  outletName: string;
  /** The state of this RSC route */
  state: any;
  isRSC: boolean;
  children?: ReactElement;
};

const DEFAULT_MAX_AGE = 500;
const cache = new Map();

export function RSCSubRouteClient({
  outletName,
  state,
  isRSC,
  children,
}: RSCSubRouteClientProps) {
  console.log('RSCSubRouteClient', outletName);
  const [_, startTransition] = useTransition();
  const [response, setResponse] = useState(<Suspense>{children}</Suspense>);
  const [expiry, setExpiry] = useState(Date.now() + DEFAULT_MAX_AGE);

  useEffect(() => {
    if (isRSC || expiry < Date.now()) {
      console.log('isRsc', isRSC);
      startTransition(() => {
        const cachedEntry = getSubServerResponse({
          ...state,
          pathname: window.location.pathname,
          search: window.location.search,
          outlet: outletName,
        });
        if (cachedEntry.expiry > expiry) {
          setExpiry(cachedEntry.expiry);
          setResponse(cachedEntry.response);
        }
      });
    }
  }, [isRSC, expiry]);

  return (
    <ErrorBoundary
      fallbackRender={() => {
        return null;
      }}
    >
      {/* @ts-ignore */}
      {response && response.readRoot ? response.readRoot() : response}
    </ErrorBoundary>
  );
}

function getSubServerResponse(state: any) {
  const key = JSON.stringify(state);
  const cacheEntry = cache.get(key);

  console.log('cache', state.outlet, cacheEntry);

  if (cacheEntry && Date.now() < cacheEntry.expiry) {
    console.log('cached', cacheEntry);
    return cacheEntry.response;
  }

  console.log('fetch', key);

  const response = createFromFetch(
    fetch(`${RSC_PATHNAME}?state=` + encodeURIComponent(key)).then((res) => {
      // let maxAge: number = DEFAULT_MAX_AGE;
      // const cacheControl = res.headers.get('cache-control');

      // if (cacheControl) {
      //   const maxAgeMatch = cacheControl.match(/max-age=(\d*)/);
      //   if (maxAgeMatch) {
      //     try {
      //       maxAge = parseInt(maxAgeMatch[1]) * 1000;
      //     } catch {
      //       maxAge = DEFAULT_MAX_AGE;
      //     }
      //   }
      // }

      // mergeCacheEntry(key, {
      //   expiry:
      //     Math.floor(res.status / 100) === 2
      //       ? Date.now() + maxAge
      //       : Date.now() + DEFAULT_MAX_AGE,
      // });

      return res;
    })
  );

  // mergeCacheEntry(key, {
  //   response,
  // });

  cache.set(key, {
    response,
    expiry: Date.now() + DEFAULT_MAX_AGE,
  });

  return cache.get(key);
}

// function mergeCacheEntry(key: string, data: any) {
//   const cachedData = cache.get(key);
//   cache.set(key, {
//     ...cachedData,
//     ...data,
//   });
// }
