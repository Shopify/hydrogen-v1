import React, {ElementType} from 'react';
import {Props} from '../types';
import {useServerState} from '../../foundation/useServerState';
/**
 * The `ProductTitle` component renders a `span` element (or the type of
 * HTML element specified by the `as` prop) with the product's [`title`](/api/storefront/reference/products/product).
 * It must be a descendent of the `ProductProvider` component.
 */
export function ProductSort<TTag extends ElementType = 'ul'>(
  /** The `as` prop is an HTML element to wrap the title. If not specified, then the
   * title is wrapped in a `span` element.
   */
  props: Props<TTag>
) {
  const {setServerState} = useServerState();
  const {as, ...passthroughProps} = props;
  const Wrapper = as ? as : 'span';

  const sortOptions = [
    {title: 'created', sortKey: 'created'},
    {title: 'ID', sortKey: 'id'},
    {title: 'price', sortKey: 'price'},
    {title: 'best selling', sortKey: 'best_selling'},
  ];

  function updateUrlWithSortParam(key: string, value: string) {
    const url = new URL(window.location.href);
    url.searchParams.set(key, value);
    window.history.pushState({}, '', url.href);
  }

  function sortOptionMarkup(sortOption: any) {
    return (
      <li key={sortOption.sortKey}>
        <a
          onClick={() => {
            updateUrlWithSortParam('sort_by', sortOption.sortKey);
            setServerState('productsSortKey', sortOption.sortKey.toUpperCase());
          }}
        >
          {sortOption.title}
        </a>
      </li>
    );
  }

  return (
    <Wrapper {...passthroughProps}>
      {sortOptions.map((option) => sortOptionMarkup(option))}
    </Wrapper>
  );
}
