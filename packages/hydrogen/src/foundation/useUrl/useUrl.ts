/* eslint-disable react-hooks/rules-of-hooks */
import {RSC_PATHNAME} from '../../constants';
import {useEnvContext, META_ENV_SSR} from '../ssr-interop';

/**
 * The `useUrl` hook retrieves the current URL in a server or client component.
 */
export function useUrl(): URL {
  if (META_ENV_SSR) {
    const serverUrl = new URL(useEnvContext((req) => req.url));

    if (serverUrl.pathname === RSC_PATHNAME) {
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
