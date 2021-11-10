import {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';
import {ServerStateContextValue} from '../ServerStateProvider';
import {useServerState} from '../useServerState';

/**
 * Since we don't render each <Route> on the client like React Router expects,
 * this listens for changes to `location` and proxies the new pathname to
 * server state, which in turn fetches the correct server component.
 */
export function ServerStateRouter() {
  const {setServerState, pending, serverState} =
    useServerState() as ServerStateContextValue;
  const [isNavigating, setIsNavigating] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (serverState.pathname !== location.pathname) {
      setIsNavigating(true);
      setServerState('pathname', location.pathname);
    }
  }, [location.pathname, setServerState]);

  useEffect(() => {
    /**
     * Indicates navigation has occurred
     */
    if (isNavigating && !pending) {
      window.scrollTo(0, 0);
      setIsNavigating(false);
    }
  }, [isNavigating, pending]);

  return null;
}
