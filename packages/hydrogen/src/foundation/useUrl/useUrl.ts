import {REACT_HYDRATION_REQUEST} from '../../constants';
import {META_ENV_SSR} from '../../utilities/meta-env-ssr';
import {useServerRequest} from '../ServerRequestProvider';

/**
 * The `useUrl` hook retrieves the current URL in a server or client component.
 */
export function useUrl(): URL {
  if (META_ENV_SSR) {
    const serverUrl = new URL(useServerRequest().url);

    if (serverUrl.pathname === REACT_HYDRATION_REQUEST) {
      const state = JSON.parse(serverUrl.searchParams.get('state') || '{}');

      const parsedUrl = `${serverUrl.origin}/${state.pathname ?? ''}${
        state.search ?? ''
      }`;

      return new URL(parsedUrl);
    }

    return new URL(serverUrl);
  }

  return new URL(window.location.href);
}
