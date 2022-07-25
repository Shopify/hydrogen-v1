import React, {ReactNode, ElementType, Fragment} from 'react';
import {useCart} from '../CartProvider/index.js';
import {CartLineProvider} from '../CartLineProvider/index.js';
import {Props} from '../types.js';

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
