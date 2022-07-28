import React, {ReactNode} from 'react';
import {CartLineContext} from './context.js';
import {Cart} from '../CartProvider/index.js';

/**
 * The `CartLineProvider` component creates a context for using a cart line.
 */
export function CartLineProvider({
  children,
  line,
}: {
  /** Any `ReactNode` elements. */
  children: ReactNode;
  /** A cart line object. */
  line: Cart['lines'][1];
}) {
  return (
    <CartLineContext.Provider value={line}>{children}</CartLineContext.Provider>
  );
}
