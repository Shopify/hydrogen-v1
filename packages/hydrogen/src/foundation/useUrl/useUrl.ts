import {RSC_PATHNAME} from '../../constants';
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

  return new URL(window.location.href);
}
