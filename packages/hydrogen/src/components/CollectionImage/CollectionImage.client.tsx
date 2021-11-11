import React, {ElementType} from 'react';
import {Image, ImagePropsWeControl} from '../Image';
import {Props} from '../types';
import {useCollection} from '../../hooks';
import {ImageSizeOptions} from '../../utilities';

/**
 * The `CollectionImage` component renders a `Image` component with
 * the collection's [`image`](/api/storefront/reference/products/collection).
 * It must be a descendent of the `CollectionProvider` component.
 */
export function CollectionImage<TTag extends ElementType = 'img'>(
  props: Props<TTag, ImagePropsWeControl> & {options?: ImageSizeOptions}
) {
  const collection = useCollection();

  if (collection == null) {
    throw new Error('Expected a ProductProvider context, but none was found');
  }

  return collection.image ? (
    <Image image={collection.image as any} {...props} />
  ) : null;
}
