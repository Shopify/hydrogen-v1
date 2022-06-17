import React from 'react';
import { BrowserRouter } from './BrowserRouter.client';
/**
 * The `Router` component provides the context for routing in your Hydrogen app.
 */
export function Router({ children }) {
    return React.createElement(BrowserRouter, null, children);
}
