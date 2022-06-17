import React from 'react';
import { CartLineContext } from './context';
/**
 * The `CartLineProvider` component creates a context for using a cart line.
 */
export function CartLineProvider({ children, line, }) {
    return (React.createElement(CartLineContext.Provider, { value: line }, children));
}
