import React, {ElementType} from 'react';
import {useCartLine} from '../CartLineProvider';
import {Image} from '../Image';
import {Props} from '../types';
import {ImageSizeOptions} from '../../utilities';

/**
 * The `CartLineImage` component renders an `Image` component for the cart line merchandise's image.
 * It must be a descendent of a `CartLineProvider` component.
 */
export function CartLineImage<TTag extends ElementType = 'img'>(
  props: Props<TTag> & {options?: ImageSizeOptions}
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
