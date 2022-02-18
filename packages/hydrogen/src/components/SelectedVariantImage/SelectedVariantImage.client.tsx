import React, {ElementType} from 'react';
import {useProduct} from '../ProductProvider';
import {Props} from '../types';
import {Image} from '../Image';
import {ImageSizeOptions} from '../../utilities';

/**
 * The `SelectedVariantImage` component renders an `Image` component for the product's selected variant's image.
 * It must be a descendent of a `ProductProvider` component.
 */
export function SelectedVariantImage<TTag extends ElementType = 'img'>(
  props: Props<TTag> & {options?: ImageSizeOptions}
) {
  const product = useProduct();

  if (product == null) {
    throw new Error('Expected a Product context, but none was found');
  }

  const {options, ...passthroughProps} = props;

  return product.selectedVariant?.image ? (
    <Image
      data={product.selectedVariant.image}
      options={options}
      {...passthroughProps}
    />
  ) : null;
}
