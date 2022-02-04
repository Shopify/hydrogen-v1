import {META_ENV_SSR} from '../../utilities/meta-env-ssr';
import {useServerRequest} from '../ServerRequestProvider';

export function useCurrentUrl(): URL {
  if (META_ENV_SSR) {
    const serverUrl = new URL(useServerRequest().url);

    if (serverUrl.pathname === '/react') {
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
