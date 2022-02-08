import React, {ReactNode, ElementType, Fragment} from 'react';
import {Cart, useCart} from '../CartProvider';
import {CartLineProvider} from '../CartLineProvider';
import {Props} from '../types';

export interface CartLinesProps {
  /** A `ReactNode` element. Valid values: `ul` or `undefined`. If `ul`, then each child will
   * be wrapped with a `li` element.
   */
  as?: 'ul';
  /** A `ReactNode` element or a function that takes a cart line as an argument and returns a `ReactNode`. */
  children: ReactNode | ((line: Cart['lines'][1]) => ReactNode);
}

/**
 * The `CartLines` component iterates over each cart line and renders its `children` within
 * a `CartLineProvider` for each cart line. It also provides render props in the case where `children` is a function.
 */
export function CartLines<TTag extends ElementType>(
  props: Props<TTag> & CartLinesProps
) {
  const {lines} = useCart();
  const {as, children, ...passthroughProps} = props;

  const Wrapper: any = as ?? Fragment;
  const ChildWrapper = Wrapper === 'ul' ? 'li' : Fragment;

  return (
    <Wrapper {...passthroughProps}>
      {lines.map((line) => {
        return (
          <ChildWrapper key={line.id}>
            <CartLineProvider line={line}>{children}</CartLineProvider>
          </ChildWrapper>
        );
      })}
    </Wrapper>
  );
}
