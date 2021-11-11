import React, {ElementType} from 'react';
import {Props} from '../types';
import {useServerState} from '../../foundation/useServerState';
import {setQueryStringParam} from '../../foundation/QueryString';

/**
 * The `ProductTitle` component renders a `span` element (or the type of
 * HTML element specified by the `as` prop) with the product's [`title`](/api/storefront/reference/products/product).
 * It must be a descendent of the `ProductProvider` component.
 */
export function ProductSortOption<TTag extends ElementType>(
  /** The `as` prop is an HTML element to wrap the title. If not specified, then the
   * title is wrapped in a `span` element.
   */
  props: Props<TTag>
) {
  const {setServerState} = useServerState();
  const {children, sortOption, ...passthroughProps} = props;

  return (
    <span
      onClick={() => {
        setQueryStringParam('sort_by', sortOption.sortKey);
        setServerState('productsSortKey', sortOption.sortKey.toUpperCase());
      }}
      {...passthroughProps}
    >
      {children}
    </span>
  );
}
