import React, {ReactElement, cloneElement, ElementType, Fragment} from 'react';
import {Props} from '../types';
import {useCartLine} from '../CartLineProvider';

interface SelectedOptionsRenderProps {
  /** The name value for the attribute. */
  name?: string;
  /** The value for the attribute. */
  value?: string;
}

/**
 * The `CartLineSelectedOptions` component takes a function as a child and calls that function
 * for each of the cart line merchandise's selected options. It must be a descendent of a `CartLineProvider` component.
 */
export function CartLineSelectedOptions<TTag extends ElementType>(
  props: Props<TTag> & {
    /** A function that takes an object as an argument and returns a `ReactNode`. */
    children: (props: SelectedOptionsRenderProps) => ReactElement;
  }
) {
  const cartLine = useCartLine();
  const {as, children, ...passthroughProps} = props;

  const Wrapper = as ? as : 'ul';
  const ChildWrapper = Wrapper === 'ul' ? 'li' : Fragment;

  return (
    <Wrapper {...passthroughProps}>
      {cartLine.merchandise.selectedOptions.map((option) => (
        <ChildWrapper key={`${option.name}-${option.value}`}>
          {cloneElement(children(option))}
        </ChildWrapper>
      ))}
    </Wrapper>
  );
}
