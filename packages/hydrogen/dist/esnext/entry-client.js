import React, { Suspense, useState, StrictMode, Fragment, } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import { createFromFetch, createFromReadableStream,
// @ts-ignore
 } from '@shopify/hydrogen/vendor/react-server-dom-vite';
import { RSC_PATHNAME } from './constants';
import { ServerPropsProvider } from './foundation/ServerPropsProvider';
import { ClientAnalytics } from './foundation/Analytics/';
let rscReader;
const cache = new Map();
// Hydrate an SSR response from <meta> tags placed in the DOM.
const flightChunks = [];
const FLIGHT_ATTRIBUTE = 'data-flight';
function addElementToFlightChunks(el) {
    // We don't need to decode, because `.getAttribute` already decodes
    const chunk = el.getAttribute(FLIGHT_ATTRIBUTE);
    if (chunk) {
        flightChunks.push(chunk);
    }
}
// Get initial payload
document
    .querySelectorAll('[' + FLIGHT_ATTRIBUTE + ']')
    .forEach(addElementToFlightChunks);
// Create a mutation observer on the document to detect when new
// <meta data-flight> tags are added, and add them to the array.
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement &&
                node.tagName === 'META' &&
                node.hasAttribute(FLIGHT_ATTRIBUTE)) {
                addElementToFlightChunks(node);
            }
        });
    });
});
observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
});
if (flightChunks.length > 0) {
    const contentLoaded = new Promise((resolve) => document.addEventListener('DOMContentLoaded', resolve));
    try {
        rscReader = new ReadableStream({
            start(controller) {
                const encoder = new TextEncoder();
                const write = (chunk) => {
                    controller.enqueue(encoder.encode(chunk));
                    return 0;
                };
                flightChunks.forEach(write);
                flightChunks.push = write;
                contentLoaded.then(() => {
                    controller.close();
                    observer.disconnect();
                });
            },
        });
    }
    catch (_) {
        // Old browser, will try a new hydration request later
    }
}
const renderHydrogen = async (ClientWrapper) => {
    const root = document.getElementById('root');
    if (!root) {
        console.error(`Could not find a root element <div id="root"></div> to render.`);
        return;
    }
    if (import.meta.hot) {
        import.meta.hot.on('hydrogen-browser-console', ({ type, data }) => {
            if (type === 'warn') {
                console.warn(data);
            }
        });
    }
    let config;
    try {
        config = JSON.parse(root.dataset.clientConfig ?? '{}');
    }
    catch (error) {
        config = {};
        if (__HYDROGEN_DEV__) {
            console.warn('Could not parse client configuration in browser', error.message);
        }
    }
    const RootComponent = 
    // Default to StrictMode on, unless explicitly turned off
    config.strictMode !== false ? StrictMode : Fragment;
    hydrateRoot(root, React.createElement(React.Fragment, null,
        React.createElement(RootComponent, null,
            React.createElement(ErrorBoundary, { FallbackComponent: Error },
                React.createElement(Suspense, { fallback: null },
                    React.createElement(Content, { clientWrapper: ClientWrapper }))))));
};
export default renderHydrogen;
function Content({ clientWrapper: ClientWrapper = ({ children }) => children, }) {
    const [serverProps, setServerProps] = useState({
        pathname: window.location.pathname,
        search: window.location.search,
    });
    const response = useServerResponse(serverProps);
    return (React.createElement(ServerPropsProvider, { initialServerProps: serverProps, setServerPropsForRsc: setServerProps },
        React.createElement(ClientWrapper, null, response.readRoot())));
}
function Error({ error }) {
    if (import.meta.env.DEV) {
        return (React.createElement("div", { style: { padding: '1em' } },
            React.createElement("h1", { style: { fontSize: '2em', marginBottom: '1em', fontWeight: 'bold' } }, "Error"),
            React.createElement("pre", { style: { whiteSpace: 'pre-wrap' } }, error.stack)));
    }
    return (React.createElement("div", { style: {
            padding: '2em',
            textAlign: 'center',
        } },
        React.createElement("h1", { style: { fontSize: '2em', marginBottom: '1em', fontWeight: 'bold' } }, "Something's wrong here..."),
        React.createElement("div", { style: { fontSize: '1.1em' } },
            React.createElement("p", null, "We found an error while loading this page."),
            React.createElement("p", null,
                "Please, refresh or go back to the",
                ' ',
                React.createElement("a", { href: "/", style: { textDecoration: 'underline' } }, "home page"),
                "."))));
}
function useServerResponse(state) {
    const key = JSON.stringify(state);
    let response = cache.get(key);
    if (response) {
        return response;
    }
    if (rscReader) {
        // The flight response was inlined during SSR, use it directly.
        response = createFromReadableStream(rscReader);
        rscReader = null;
    }
    else {
        if (
        /* @ts-ignore */
        window.BOOMR &&
            /* @ts-ignore */
            window.BOOMR.plugins &&
            /* @ts-ignore */
            window.BOOMR.plugins.Hydrogen) {
            /* @ts-ignore */
            window.BOOMR.plugins.Hydrogen.trackSubPageLoadPerformance();
        }
        ClientAnalytics.resetPageAnalyticsData();
        // Request a new flight response.
        response = createFromFetch(fetch(`${RSC_PATHNAME}?state=` + encodeURIComponent(key)));
    }
    cache.clear();
    cache.set(key, response);
    return response;
}
