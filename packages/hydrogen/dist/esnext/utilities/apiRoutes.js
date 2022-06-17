import { matchPath } from './matchPath';
import { getLoggerWithContext, logServerResponse } from '../utilities/log/';
import { fetchBuilder, graphqlRequestBody } from './fetch';
import { getStorefrontApiRequestHeaders } from './storefrontApi';
import { emptySessionImplementation, } from '../foundation/session/session';
let memoizedApiRoutes = [];
let memoizedRawRoutes = {};
export function extractPathFromRoutesKey(routesKey, dirPrefix) {
    let path = routesKey
        .replace(dirPrefix, '')
        .replace(/\.server\.(t|j)sx?$/, '')
        /**
         * Replace /index with /
         */
        .replace(/\/index$/i, '/')
        /**
         * Only lowercase the first letter. This allows the developer to use camelCase
         * dynamic paths while ensuring their standard routes are normalized to lowercase.
         */
        .replace(/\b[A-Z]/, (firstLetter) => firstLetter.toLowerCase())
        /**
         * Convert /[handle].jsx and /[...handle].jsx to /:handle.jsx for react-router-dom
         */
        .replace(/\[(?:[.]{3})?(\w+?)\]/g, (_match, param) => `:${param}`);
    if (path.endsWith('/') && path !== '/') {
        path = path.substring(0, path.length - 1);
    }
    return path;
}
export function getApiRoutes({ files: routes, basePath: topLevelPath = '', dirPrefix = '', }) {
    if (!routes || memoizedRawRoutes === routes)
        return memoizedApiRoutes;
    const topLevelPrefix = topLevelPath.replace('*', '').replace(/\/$/, '');
    const keys = Object.keys(routes);
    const apiRoutes = keys
        .filter((key) => routes[key].api)
        .map((key) => {
        const path = extractPathFromRoutesKey(key, dirPrefix);
        /**
         * Catch-all routes [...handle].jsx don't need an exact match
         * https://reactrouter.com/core/api/Route/exact-bool
         */
        const exact = !/\[(?:[.]{3})(\w+?)\]/.test(key);
        return {
            path: topLevelPrefix + path,
            resource: routes[key].api,
            hasServerComponent: !!routes[key].default,
            exact,
        };
    });
    memoizedApiRoutes = [
        ...apiRoutes.filter((route) => !route.path.includes(':')),
        ...apiRoutes.filter((route) => route.path.includes(':')),
    ];
    memoizedRawRoutes = routes;
    return memoizedApiRoutes;
}
export function getApiRouteFromURL(url, routes) {
    let foundRoute, foundRouteDetails;
    for (let i = 0; i < routes.length; i++) {
        foundRouteDetails = matchPath(url.pathname, routes[i]);
        if (foundRouteDetails) {
            foundRoute = routes[i];
            break;
        }
    }
    if (!foundRoute)
        return null;
    return {
        resource: foundRoute.resource,
        params: foundRouteDetails.params,
        hasServerComponent: foundRoute.hasServerComponent,
    };
}
function queryShopBuilder(shopifyConfigGetter, request) {
    return async function queryShop({ query, variables, }) {
        const shopifyConfig = typeof shopifyConfigGetter === 'function'
            ? await shopifyConfigGetter(request)
            : shopifyConfigGetter;
        if (!shopifyConfig) {
            throw new Error('Shopify connection info was not found in Hydrogen config');
        }
        const { storeDomain, storefrontApiVersion, storefrontToken } = shopifyConfig;
        const buyerIp = request.getBuyerIp();
        const extraHeaders = getStorefrontApiRequestHeaders({
            buyerIp,
            storefrontToken,
        });
        const fetcher = fetchBuilder(`https://${storeDomain}/api/${storefrontApiVersion}/graphql.json`, {
            method: 'POST',
            body: graphqlRequestBody(query, variables),
            headers: {
                'Content-Type': 'application/json',
                ...extraHeaders,
            },
        });
        return await fetcher();
    };
}
export async function renderApiRoute(request, route, hydrogenConfig, { session, suppressLog, }) {
    let response;
    const log = getLoggerWithContext(request);
    let cookieToSet = '';
    try {
        response = await route.resource(request, {
            params: route.params,
            queryShop: queryShopBuilder(hydrogenConfig.shopify, request),
            hydrogenConfig,
            session: session
                ? {
                    async get() {
                        return session.get(request);
                    },
                    async set(key, value) {
                        const data = await session.get(request);
                        data[key] = value;
                        cookieToSet = await session.set(request, data);
                    },
                    async destroy() {
                        cookieToSet = await session.destroy(request);
                    },
                }
                : emptySessionImplementation(log),
        });
        if (!(response instanceof Response || response instanceof Request)) {
            if (typeof response === 'string' || response instanceof String) {
                response = new Response(response);
            }
            else if (typeof response === 'object') {
                response = new Response(JSON.stringify(response), {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            }
        }
        if (!response) {
            response = new Response(null);
        }
        if (cookieToSet) {
            response.headers.set('Set-Cookie', cookieToSet);
        }
    }
    catch (e) {
        log.error(e);
        response = new Response('Error processing: ' + request.url, { status: 500 });
    }
    if (!suppressLog) {
        logServerResponse('api', request, response.status ?? 200);
    }
    return response;
}
