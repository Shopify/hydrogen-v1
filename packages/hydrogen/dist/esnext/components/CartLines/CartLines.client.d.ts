import { ReactNode, ElementType } from 'react';
import { Props } from '../types';
export interface CartLinesProps {
    /** A `ReactNode` element. Valid values: `ul` or `undefined`. If `ul`, then each child will
     * be wrapped with a `li` element.
     */
    as?: 'ul';
    /** A `ReactNode` element */
    children: ReactNode;
}
/**
 * The `CartLines` component iterates over each cart line and renders its `children` within
 * a `CartLineProvider` for each cart line.
 */
export declare function CartLines<TTag extends ElementType>(props: Props<TTag> & CartLinesProps): JSX.Element;
