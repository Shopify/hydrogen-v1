import { useMemo } from 'react';
import { RSC_PATHNAME } from '../../constants';
import { parseJSON } from '../../utilities/parse';
import { useLocation } from '../Router/BrowserRouter.client';
import { useEnvContext, META_ENV_SSR } from '../ssr-interop';
/**
 * The `useUrl` hook retrieves the current URL in a server or client component.
 */
export function useUrl() {
    if (META_ENV_SSR) {
        const serverUrl = new URL(useEnvContext((req) => req.url) // eslint-disable-line react-hooks/rules-of-hooks
        );
        if (serverUrl.pathname === RSC_PATHNAME) {
            const state = parseJSON(serverUrl.searchParams.get('state') || '{}');
            const parsedUrl = `${serverUrl.origin}${state.pathname ?? ''}${state.search ?? ''}`;
            return new URL(parsedUrl);
        }
        return new URL(serverUrl);
    }
    /**
     * We return a `URL` object instead of passing through `location` because
     * the URL object contains important info like hostname, etc.
     */
    const location = useLocation(); // eslint-disable-line react-hooks/rules-of-hooks
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useMemo(() => new URL(window.location.href), [location]); // eslint-disable-line react-hooks/exhaustive-deps
}
