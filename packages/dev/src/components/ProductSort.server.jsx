import {ProductSortOption} from '@shopify/hydrogen';

export default function ProductSort() {
  const sortOptions = [
    {title: 'created', sortKey: 'created'},
    {title: 'price', sortKey: 'price'},
    {title: 'best selling', sortKey: 'best_selling'},
  ];

  return (
    <>
      <b> sort by: </b>
      <ul>
        {sortOptions.map((sortOption) => (
          <li key={sortOption.sortKey}>
            <ProductSortOption
              sortOption={sortOption}
              className="cursor-pointer"
            >
              {sortOption.title}
            </ProductSortOption>
          </li>
        ))}
      </ul>
    </>
  );
}
