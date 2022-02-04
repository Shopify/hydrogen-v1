import {createBrowserHistory, BrowserHistory, Location} from 'history';
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  FC,
  useEffect,
} from 'react';
import {useServerState} from '../useServerState';

type RouterContextValue = {
  history: BrowserHistory;
  location: Location;
};

const RouterContext = createContext<RouterContextValue | null>(null);

export const Router: FC = ({children}) => {
  const history = useMemo(() => createBrowserHistory(), []);
  const [firstLoad, setFirstLoad] = useState(true);
  const [location, setLocation] = useState(history.location);

  const {pending} = useServerState();

  useEffect(() => {
    // The app has just loaded
    if (firstLoad) setFirstLoad(false);
    // A navigation event has just happened
    else if (!pending) {
      window.scrollTo(0, 0);
    }
  }, [pending]);

  useEffect(() => {
    const unlisten = history.listen(({location}) => {
      setLocation(location);
    });

    return () => unlisten();
  }, []);

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
  return useContext(RouterContext) as RouterContextValue;
}

export function useLocation() {
  return useRouter().location;
}
