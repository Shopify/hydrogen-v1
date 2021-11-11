import React, {ElementType} from 'react';
import {RawHtml} from '../RawHtml';
import {Props} from '../types';
import {useCollection} from '../../hooks';

/**
 * The `CollectionDescription` component renders a `RawHtml` component with
 * the collection's [`descriptionHtml`](/api/storefront/reference/products/collection).
 * It must be a descendent of the `CollectionProvider` component.
 */
export function CollectionDescription<TTag extends ElementType = 'div'>(
  props: Props<TTag>
) {
  const collection = useCollection();

  if (collection == null) {
    throw new Error('Expected a ProductProvider context, but none was found');
  }

  return collection.descriptionHtml ? (
    <RawHtml string={collection.descriptionHtml} {...props} />
  ) : null;
}
