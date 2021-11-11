import React, {ElementType} from 'react';
import {useCollection} from '../../hooks';
import {Props} from '../types';

export function CollectionTitle<TTag extends ElementType = 'span'>(
  /** The `as` prop is an HTML element to wrap the title. If not specified, then the
   * title is wrapped in a `span` element.
   */
  props: Props<TTag>
) {
  const collection = useCollection();

  if (collection == null) {
    throw new Error(
      'Expected a CollectionProvider context, but none was found'
    );
  }

  const {as, ...passthroughProps} = props;

  const Wrapper = as ? as : 'span';

  return collection.title ? (
    <Wrapper {...passthroughProps}>{collection.title}</Wrapper>
  ) : null;
}
