import React, {ReactElement, cloneElement, ElementType, Fragment} from 'react';
import {Props} from '../types';
import {useCartLine} from '../CartLineProvider';
import {Cart} from '../CartProvider';

/** The `CartLineAttributes` components provides an object with the following keys as a render prop: */
interface AttributesRenderProps {
  /** The key value for the attribute. */
  key: string;
  /** The value for the attribute. */
  value?: string | null;
}

/**
 * The `CartLineAttributes` component takes a function as a child and calls that function for each of the
 * cart line's attributes. It must be a descendent of a `CartLineProvider` component.
 */
export function CartLineAttributes<TTag extends ElementType>(
  props: Props<TTag> & {
    /** A `ReactNode` element. Valid values: `ul` or `undefined`. If `ul`, then each child will
     * be wrapped with a `li` element.
     */
    as?: ElementType;
    /** A function that takes an object as an argument and returns a `ReactNode`. */
    children: (props: AttributesRenderProps) => ReactElement;
  }
) {
  const cartLine = useCartLine();
  const {as, children, ...passthroughProps} = props;

  const Wrapper = as ? as : 'ul';
  const ChildWrapper = Wrapper === 'ul' ? 'li' : Fragment;

  return (
    <Wrapper {...passthroughProps}>
      {cartLine.attributes.map(
        (attribute: Cart['lines'][1]['attributes'][1]) => (
          <ChildWrapper key={`${attribute.key}-${attribute.value}`}>
            {cloneElement(children(attribute))}
          </ChildWrapper>
        )
      )}
    </Wrapper>
  );
}
