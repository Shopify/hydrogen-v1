import {ProductSortOption} from '@shopify/hydrogen';
import {Fragment} from 'react';

export default function ProductSort() {
  const sortOptions = [
    {title: 'created', sortKey: 'created'},
    {title: 'price', sortKey: 'price'},
    {title: 'best selling', sortKey: 'best_selling'},
  ];

  return (
    <>
      <ul>
        {sortOptions.map((sortOption) => (
          <ProductSortOption
            key={sortOption.sortKey}
            sortOption={sortOption}
            className="border-2 border-red-700 block"
          >
            <li>{sortOption.title}</li>
          </ProductSortOption>
        ))}
      </ul>
    </>
  );
}
