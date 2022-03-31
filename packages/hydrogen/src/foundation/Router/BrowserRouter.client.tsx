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
import {useInternalServerProps} from '../useServerProps/use-server-props';

type RouterContextValue = {
  history: BrowserHistory;
  location: Location;
};

export const RouterContext = createContext<RouterContextValue | {}>({});

let currentPath = '';
let isFirstLoad = true;

export const BrowserRouter: FC<{history?: BrowserHistory}> = ({
  history: pHistory,
  children,
}) => {
  if (META_ENV_SSR) return <>{children}</>;

  const history = useMemo(() => pHistory || createBrowserHistory(), [pHistory]);
  const [location, setLocation] = useState(history.location);

  const {pending, locationServerProps, setLocationServerProps} =
    useInternalServerProps();

  useEffect(() => {
    // The app has just loaded
    if (isFirstLoad) isFirstLoad = false;
    // A navigation event has just happened
    else if (!pending && currentPath !== locationServerProps.pathname) {
      window.scrollTo(0, 0);
    }

    currentPath = locationServerProps.pathname;
  }, [pending]);

  useEffect(() => {
    const unlisten = history.listen(({location: newLocation}) => {
      setLocationServerProps({
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
