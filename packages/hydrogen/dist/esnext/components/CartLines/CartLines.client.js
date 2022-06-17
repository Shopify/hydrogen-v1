import React, { Fragment } from 'react';
import { useCart } from '../CartProvider';
import { CartLineProvider } from '../CartLineProvider';
/**
 * The `CartLines` component iterates over each cart line and renders its `children` within
 * a `CartLineProvider` for each cart line.
 */
export function CartLines(props) {
    const { lines } = useCart();
    const { as, children, ...passthroughProps } = props;
    const Wrapper = as ?? Fragment;
    const ChildWrapper = Wrapper === 'ul' ? 'li' : Fragment;
    return (React.createElement(Wrapper, { ...passthroughProps }, lines.map((line) => {
        return (React.createElement(ChildWrapper, { key: line.id },
            React.createElement(CartLineProvider, { line: line }, children)));
    })));
}
