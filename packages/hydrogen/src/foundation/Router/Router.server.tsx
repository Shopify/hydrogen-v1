import React, {ReactElement} from 'react';
import {BrowserRouter} from './BrowserRouter.client';

type RouterProps = {
  children: Array<ReactElement> | ReactElement;
};

/**
 * The `Router` component provides the context for routing in your Hydrogen app.
 * You should only have one `Router` component in your app.
 * All [`FileRoutes`](#fileroutes-component) and [`Route`](#route-component) components must be children of `Router`.
 */
export function Router({children}: RouterProps): ReactElement {
  return <BrowserRouter>{children}</BrowserRouter>;
}
