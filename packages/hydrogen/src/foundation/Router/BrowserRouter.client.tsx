import {createBrowserHistory, BrowserHistory, Location} from 'history';
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  FC,
  useEffect,
} from 'react';
import {META_ENV_SSR} from '../ssr-interop';
import {useServerState} from '../useServerState';

type RouterContextValue = {
  history: BrowserHistory;
  location: Location;
};

export const RouterContext = createContext<RouterContextValue | {}>({});

let currentPath = '';

export const BrowserRouter: FC<{
  history?: BrowserHistory;
}> = ({history: pHistory, children}) => {
  if (META_ENV_SSR) return <>{children}</>;

  const history = useMemo(() => pHistory || createBrowserHistory(), [pHistory]);
  const [firstLoad, setFirstLoad] = useState(true);
  const [location, setLocation] = useState(history.location);

  const {pending, serverState, setServerState} = useServerState();

  useEffect(() => {
    // The app has just loaded
    if (firstLoad) setFirstLoad(false);
    // A navigation event has just happened
    else if (!pending && currentPath !== serverState.pathname) {
      window.scrollTo(0, 0);
    }

    currentPath = serverState.pathname;
  }, [pending]);

  useEffect(() => {
    const unlisten = history.listen(({location: newLocation}) => {
      setServerState({
        pathname: newLocation.pathname,
        search: location.search || undefined,
      });

      setLocation(newLocation);
    });

    return () => unlisten();
  }, [history]);

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
