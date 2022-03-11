import React from 'react';
import {useCartLine} from '../CartLineProvider';
import {Image} from '../Image';
import {ImageSizeOptions} from '../../utilities';

type PropsWeControl = 'data' | 'options';

/**
 * The `CartLineImage` component renders an `Image` component for the cart line merchandise's image.
 * It must be a descendent of a `CartLineProvider` component.
 */
export function CartLineImage(
  props: Omit<React.ComponentProps<typeof Image>, PropsWeControl> & {
    options?: ImageSizeOptions;
  }
) {
  const cartLine = useCartLine();

  const {options, ...passthroughProps} = props;

  return cartLine.merchandise.image ? (
    <Image
      {...passthroughProps}
      data={cartLine.merchandise.image}
      options={options}
    />
  ) : null;
}
