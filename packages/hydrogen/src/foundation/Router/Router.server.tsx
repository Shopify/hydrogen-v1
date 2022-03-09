import React, {ReactElement} from 'react';
import {BrowserRouter} from './BrowserRouter.client';

type RouterProps = {
  children: Array<ReactElement> | ReactElement;
};

/**
 * The `Router` provides the context for Hydrogen Routing.
 * All `<Route>` and `<FileRoutes>` components must be children of `<Router>`
 */
export function Router({children}: RouterProps): ReactElement {
  return <BrowserRouter>{children}</BrowserRouter>;
}
