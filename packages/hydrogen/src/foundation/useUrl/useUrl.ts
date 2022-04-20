import {useMemo} from 'react';
import {RSC_PATHNAME} from '../../constants';
import {useLocation} from '../Router/BrowserRouter.client';
import {useEnvContext, META_ENV_SSR} from '../ssr-interop';

export function normalizeRscUrl(url: URL) {
  if (url.pathname === RSC_PATHNAME) {
    const state = JSON.parse(url.searchParams.get('state') || '{}');

    const parsedUrl = `${url.origin}${state.pathname ?? ''}${
      state.search ?? ''
    }`;

    return new URL(parsedUrl);
  }

  return url;
}

/**
 * The `useUrl` hook retrieves the current URL in a server or client component.
 */
export function useUrl(): URL {
  if (META_ENV_SSR) {
    const serverUrl = new URL(useEnvContext((req) => req.url));
    return normalizeRscUrl(serverUrl);
  }

  /**
   * We return a `URL` object instead of passing through `location` because
   * the URL object contains important info like hostname, etc.
   */
  const location = useLocation();
  return useMemo(() => new URL(window.location.href), [location]);
}
