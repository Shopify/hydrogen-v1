import { ReactNode } from 'react';
import { Cart } from '../CartProvider';
/**
 * The `CartLineProvider` component creates a context for using a cart line.
 */
export declare function CartLineProvider({ children, line, }: {
    /** Any `ReactNode` elements. */
    children: ReactNode;
    /** A cart line object. */
    line: Cart['lines'][1];
}): JSX.Element;
