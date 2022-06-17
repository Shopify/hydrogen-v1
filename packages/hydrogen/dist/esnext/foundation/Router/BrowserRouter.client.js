import { createBrowserHistory } from 'history';
import React, { createContext, useContext, useMemo, useState, useEffect, useLayoutEffect, useCallback, } from 'react';
import { META_ENV_SSR } from '../ssr-interop';
import { useInternalServerProps } from '../useServerProps/use-server-props';
export const RouterContext = createContext({});
let isFirstLoad = true;
const positions = {};
export const BrowserRouter = ({ history: pHistory, children }) => {
    if (META_ENV_SSR)
        return React.createElement(React.Fragment, null, children);
    /* eslint-disable react-hooks/rules-of-hooks */
    const history = useMemo(() => pHistory || createBrowserHistory(), [pHistory]);
    const [location, setLocation] = useState(history.location);
    const [scrollNeedsRestoration, setScrollNeedsRestoration] = useState(false);
    const { pending, locationServerProps, setLocationServerProps } = useInternalServerProps();
    useScrollRestoration({
        location,
        pending,
        serverProps: locationServerProps,
        scrollNeedsRestoration,
        onFinishNavigating: () => setScrollNeedsRestoration(false),
    });
    useLayoutEffect(() => {
        const unlisten = history.listen(({ location: newLocation, action }) => {
            positions[location.key] = window.scrollY;
            setLocationServerProps({
                pathname: newLocation.pathname,
                search: newLocation.search,
            });
            setLocation(newLocation);
            const state = (newLocation.state ?? {});
            /**
             * "pop" navigations, like forward/backward buttons, always restore scroll position
             * regardless of what the original forward navigation intent was.
             */
            const needsScrollRestoration = action === 'POP' || !!state.scroll;
            setScrollNeedsRestoration(needsScrollRestoration);
        });
        return () => unlisten();
    }, [
        history,
        location,
        setScrollNeedsRestoration,
        setLocation,
        setLocationServerProps,
    ]);
    /* eslint-enable react-hooks/rules-of-hooks */
    return (React.createElement(RouterContext.Provider, { value: {
            history,
            location,
        } }, children));
};
export function useRouter() {
    const router = useContext(RouterContext);
    if (!router && META_ENV_SSR) {
        throw new Error('useRouter must be used within a <Router> component');
    }
    return router;
}
export function useLocation() {
    return useRouter().location;
}
/**
 * Run a callback before browser unload.
 */
function useBeforeUnload(callback) {
    React.useEffect(() => {
        window.addEventListener('beforeunload', callback);
        return () => {
            window.removeEventListener('beforeunload', callback);
        };
    }, [callback]);
}
function useScrollRestoration({ location, pending, serverProps, scrollNeedsRestoration, onFinishNavigating, }) {
    /**
     * Browsers have an API for scroll restoration. We wait for the page to load first,
     * in case the browser is able to restore scroll position automatically, and then
     * set it to manual mode.
     */
    useEffect(() => {
        window.history.scrollRestoration = 'manual';
    }, []);
    /**
     * If the page is reloading, allow the browser to handle its own scroll restoration.
     */
    useBeforeUnload(useCallback(() => {
        window.history.scrollRestoration = 'auto';
    }, []));
    useLayoutEffect(() => {
        // The app has just loaded
        if (isFirstLoad || !scrollNeedsRestoration) {
            isFirstLoad = false;
            return;
        }
        const position = positions[location.key];
        /**
         * When serverState gets updated, `pending` is true while the fetch is in progress.
         * When that resolves, the serverState is updated. We should wait until the internal
         * location pointer and serverState match, and pending is false, to do any scrolling.
         */
        const finishedNavigating = !pending &&
            location.pathname === serverProps.pathname &&
            location.search === serverProps.search;
        if (!finishedNavigating) {
            return;
        }
        // If there is a location hash, scroll to it
        if (location.hash) {
            const element = document.querySelector(location.hash);
            if (element) {
                element.scrollIntoView();
                onFinishNavigating();
                return;
            }
        }
        // If we have a matching position, scroll to it
        if (position) {
            window.scrollTo(0, position);
            onFinishNavigating();
            return;
        }
        // Scroll to the top of new pages
        window.scrollTo(0, 0);
        onFinishNavigating();
    }, [
        location.pathname,
        location.search,
        location.hash,
        location.key,
        pending,
        serverProps.pathname,
        serverProps.search,
        scrollNeedsRestoration,
        onFinishNavigating,
    ]);
}
