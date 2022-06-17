import { ResolvedHydrogenConfig, ResolvedHydrogenRoutes } from '../types';
import type { HydrogenRequest } from '../foundation/HydrogenRequest/HydrogenRequest.server';
import { SessionApi, SessionStorageAdapter } from '../foundation/session/session';
declare type RouteParams = Record<string, string>;
export declare type RequestOptions = {
    params: RouteParams;
    queryShop: (args: QueryShopArgs) => Promise<any>;
    session: SessionApi | null;
    hydrogenConfig: ResolvedHydrogenConfig;
};
export declare type ResourceGetter = (request: HydrogenRequest, requestOptions: RequestOptions) => Promise<Response | Object | String>;
interface HydrogenApiRoute {
    path: string;
    resource: ResourceGetter;
    hasServerComponent: boolean;
}
export declare type ApiRouteMatch = {
    resource: ResourceGetter;
    hasServerComponent: boolean;
    params: RouteParams;
};
export declare function extractPathFromRoutesKey(routesKey: string, dirPrefix: string | RegExp): string;
export declare function getApiRoutes({ files: routes, basePath: topLevelPath, dirPrefix, }: Partial<ResolvedHydrogenRoutes>): Array<HydrogenApiRoute>;
export declare function getApiRouteFromURL(url: URL, routes: Array<HydrogenApiRoute>): ApiRouteMatch | null;
/** The `queryShop` utility is a function that helps you query the Storefront API.
 * It's similar to the `useShopQuery` hook, which is available in server components.
 * To use `queryShop`, pass `shopifyConfig` to `renderHydrogen` inside `App.server.jsx`.
 */
interface QueryShopArgs {
    /** A string of the GraphQL query.
     * If no query is provided, then the `useShopQuery` makes no calls to the Storefront API.
     */
    query: string;
    /** An object of the variables for the GraphQL query. */
    variables?: Record<string, any>;
}
export declare function renderApiRoute(request: HydrogenRequest, route: ApiRouteMatch, hydrogenConfig: ResolvedHydrogenConfig, { session, suppressLog, }: {
    session?: SessionStorageAdapter;
    suppressLog?: boolean;
}): Promise<Response | Request>;
export {};
