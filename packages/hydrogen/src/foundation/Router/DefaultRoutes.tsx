import React, {ReactElement, useMemo} from 'react';
import {Route, Switch, useRouteMatch} from 'react-router-dom';
import {Logger} from '../../utilities/log/log';
import {ServerComponentRequest} from '../../framework/Hydration/ServerComponentRequest.server';
import {ServerComponentResponse} from '../../framework/Hydration/ServerComponentResponse.server';

export type ImportGlobEagerOutput = Record<
  string,
  Record<'default' | 'api', any>
>;

/**
 * Build a set of default Hydrogen routes based on the output provided by Vite's
 * import.meta.globEager method.
 *
 * @see https://vitejs.dev/guide/features.html#glob-import
 */
export function DefaultRoutes({
  pages,
  serverState,
  fallback,
  log,
}: {
  pages: ImportGlobEagerOutput;
  serverState: Record<string, any>;
  fallback?: ReactElement;
  log: Logger;
}) {
  const {path} = useRouteMatch();
  const routes = useMemo(
    () => createRoutesFromPages(pages, path),
    [pages, path]
  );

  return (
    <Switch>
      {routes.map((route) => (
        <Route key={route.path} exact={route.exact} path={route.path}>
          <route.component {...serverState} log={log} />
        </Route>
      ))}
      {fallback && <Route path="*">{fallback}</Route>}
    </Switch>
  );
}

interface HydrogenRoute {
  component: any;
  path: string;
  exact: boolean;
}

export function createRoutesFromPages(
  pages: ImportGlobEagerOutput,
  topLevelPath = '*'
): HydrogenRoute[] {
  const topLevelPrefix = topLevelPath.replace('*', '').replace(/\/$/, '');

  const routes = Object.keys(pages).map((key) => {
    const path = key
      .replace('./pages', '')
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
      .replace(
        /\[(?:[.]{3})?(\w+?)\]/g,
        (_match, param: string) => `:${param}`
      );

    /**
     * Catch-all routes [...handle].jsx don't need an exact match
     * https://reactrouter.com/core/api/Route/exact-bool
     */
    const exact = !/\[(?:[.]{3})(\w+?)\]/.test(key);

    if (!pages[key].default && !pages[key].api)
      throw new Error(
        `${key} doesn't export a default React component or an API function`
      );
    if (pages[key].default && pages[key].api)
      throw new Error(
        `${key} cannot export both a default React component and an API function`
      );

    return {
      path: topLevelPrefix + path,
      component: pages[key].default || APIComponent.bind(null, pages[key].api),
      exact,
    };
  });

  /**
   * Place static paths BEFORE dynamic paths to grant priority.
   */
  return [
    ...routes.filter((route) => !route.path.includes(':')),
    ...routes.filter((route) => route.path.includes(':')),
  ];
}

function APIComponent(
  APIFunction: any,
  props: {response: ServerComponentResponse; request: ServerComponentRequest}
) {
  props.response.doNotStream();

  const response = APIFunction(props.request);

  props.response.writeHead({
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });

  props.response.send(response);

  return null;
}
