import React, {ElementType} from 'react';
import {Props} from '../types';
import {useServerState} from '../../foundation/useServerState';
import {setQueryStringParam} from '../../foundation/QueryString';

/**
 * The `ProductSortOption` component renders a `span` element that is used to attach the click
 * event which does 2 things:
 *  1- set the query story for the sort param
 *  2 - call setServerState to pass the productsSortKey value to the server
 *      in order to refresh the product list
 */
export function ProductSortOption<TTag extends ElementType>(
  /** docs TBD
   */
  props: Props<TTag>
) {
  const {setServerState} = useServerState();
  const {children, sortKey, ...passthroughProps} = props;

  return (
    <span
      onClick={() => {
        setQueryStringParam('sort_by', sortKey);
        setServerState('productsSortKey', sortKey.toUpperCase());
      }}
      {...passthroughProps}
    >
      {children}
    </span>
  );
}
