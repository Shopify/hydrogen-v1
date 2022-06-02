import {flattenConnection} from '@shopify/hydrogen';
import {useState} from 'react';

import {Grid} from '~/components/elements';
import {ProductCard} from '~/components/blocks';

export default function ProductGrid({data}) {
  const initialProducts = flattenConnection(data.collection.products);
  const {hasNextPage, endCursor} = data.collection.products.pageInfo;

  const [products, setProducts] = useState(initialProducts);
  const [cursor, setCursor] = useState(endCursor);
  const [nextPage, setNextPage] = useState(hasNextPage);
  const [pending, setPending] = useState(false);

  const fetchProducts = async () => {
    setPending(true);
    const url = new URL(window.location.href);
    url.searchParams.set('cursor', cursor);

    const response = await fetch(url, {method: 'POST'});
    const json = await response.json();
    const newProducts = flattenConnection(json.data.collection.products);
    const {endCursor, hasNextPage} = json.data.collection.products.pageInfo;

    setProducts([...products, ...newProducts]);
    setCursor(endCursor);
    setNextPage(hasNextPage);
    setPending(false);
  };

  return (
    <>
      <Grid>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </Grid>
      {nextPage && (
        <button
          className={`bg-white border border-gray-50 font-medium p-2 disabled:bg-gray-50`}
          disabled={pending}
          onClick={fetchProducts}
        >
          {pending ? 'Loading...' : 'Load more products'}
        </button>
      )}
    </>
  );
}
