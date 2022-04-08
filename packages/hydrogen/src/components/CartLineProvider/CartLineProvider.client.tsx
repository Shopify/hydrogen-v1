import React, {ReactNode} from 'react';
import {CartLineContext} from './context';
import {Cart} from '../CartProvider';

export interface CartLineProviderProps {
  /** Any `ReactNode` elements. */
  children: ReactNode;
  /** A cart line object. */
  line: Cart['lines'][1];
}

/**
 * The `CartLineProvider` component creates a context for using a cart line.
 */
export function CartLineProvider({children, line}: CartLineProviderProps) {
  return (
    <CartLineContext.Provider value={line}>{children}</CartLineContext.Provider>
  );
}
