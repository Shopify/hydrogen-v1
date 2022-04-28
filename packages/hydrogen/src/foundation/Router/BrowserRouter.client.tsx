import {createBrowserHistory, BrowserHistory, Location} from 'history';
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  FC,
  useEffect,
  useLayoutEffect,
  useCallback,
} from 'react';
import type {LocationServerProps} from '../ServerPropsProvider/ServerPropsProvider';
import {META_ENV_SSR} from '../ssr-interop';
import {useInternalServerProps} from '../useServerProps/use-server-props';

type RouterContextValue = {
  history: BrowserHistory;
  location: Location;
};

export const RouterContext = createContext<RouterContextValue | {}>({});

let isFirstLoad = true;
const positions: Record<string, number> = {};

export const BrowserRouter: FC<{history?: BrowserHistory}> = ({
  history: pHistory,
  children,
}) => {
  if (META_ENV_SSR) return <>{children}</>;

  const history = useMemo(() => pHistory || createBrowserHistory(), [pHistory]);
  const [location, setLocation] = useState(history.location);

  const {pending, locationServerProps, setLocationServerProps} =
    useInternalServerProps();
  useScrollRestoration(location, pending, locationServerProps);

  useLayoutEffect(() => {
    const unlisten = history.listen(({location: newLocation}) => {
      positions[location.key] = window.scrollY;

      setLocationServerProps({
        pathname: newLocation.pathname,
        search: newLocation.search,
      });

      setLocation(newLocation);
    });

    return () => unlisten();
  }, [history, location]);

  return (
    <RouterContext.Provider
      value={{
        history,
        location,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
};

export function useRouter() {
  const router = useContext<RouterContextValue | {}>(RouterContext);

  if (!router && META_ENV_SSR) {
    throw new Error('useRouter must be used within a <Router> component');
  }

  return router as RouterContextValue;
}

export function useLocation() {
  return useRouter().location;
}

/**
 * Run a callback before browser unload.
 */
function useBeforeUnload(callback: () => any): void {
  React.useEffect(() => {
    window.addEventListener('beforeunload', callback);
    return () => {
      window.removeEventListener('beforeunload', callback);
    };
  }, [callback]);
}

function useScrollRestoration(
  location: Location,
  pending: boolean,
  serverProps: LocationServerProps
) {
  /**
   * Browsers have an API for scroll restoration. We wait for the page to load first,
   * in case the browser is able to restore scroll position automatically, and then
   * set it to manual mode.
   */
  useEffect(() => {
    window.history.scrollRestoration = 'manual';
  }, []);

  /**
   * If the page is reloading, allow the browser to handle its own scroll restoration.
   */
  useBeforeUnload(
    useCallback(() => {
      window.history.scrollRestoration = 'auto';
    }, [])
  );

  useLayoutEffect(() => {
    // The app has just loaded
    if (isFirstLoad) {
      isFirstLoad = false;
      return;
    }

    const position = positions[location.key];

    /**
     * When serverState gets updated, `pending` is true while the fetch is in progress.
     * When that resolves, the serverState is updated. We should wait until the internal
     * location pointer and serverState match, and pending is false, to do any scrolling.
     */
    const finishedNavigating =
      !pending &&
      location.pathname === serverProps.pathname &&
      location.search === serverProps.search;

    if (!finishedNavigating) {
      return;
    }

    // If there is a location hash, scroll to it
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView();
        return;
      }
    }

    // If we have a matching position, scroll to it
    if (position) {
      window.scrollTo(0, position);
      return;
    }

    // Scroll to the top of new pages
    window.scrollTo(0, 0);
  }, [location, pending, serverProps]);
}
