import {useState, useRef, useEffect, useCallback} from 'react';
import {flattenConnection} from '@shopify/hydrogen';

import {ProductCard} from '~/components/blocks';
import {Grid} from '~/components/elements';

export function ProductGrid({data, loadImageEagerCount = 0}) {
  const nextButtonRef = useRef(null);
  const initialProducts = data.collection.products.nodes;
  const {hasNextPage, endCursor} = data.collection.products.pageInfo;

  const [products, setProducts] = useState(initialProducts);
  const [cursor, setCursor] = useState(endCursor);
  const [nextPage, setNextPage] = useState(hasNextPage);
  const [pending, setPending] = useState(false);

  const fetchProducts = useCallback(async () => {
    setPending(true);
    // TODO: Update this logic to use Hydrogen hooks (URL, fetchSync) where appropriate.
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
  }, [cursor, products]);

  const handleIntersect = useCallback(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          fetchProducts();
        }
      });
    },
    [fetchProducts],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersect, {
      threshold: 0.1,
      rootMargin: '100px',
    });

    const nextButton = nextButtonRef.current;

    if (nextButton) observer.observe(nextButton);

    return () => {
      if (nextButton) observer.unobserve(nextButton);
    };
  }, [nextButtonRef, cursor, handleIntersect]);

  return (
    <>
      <Grid layout="products">
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            loading={index < loadImageEagerCount ? 'eager' : null}
          />
        ))}
      </Grid>

      {nextPage && (
        <button
          className={`bg-white border border-gray-50 font-medium p-2 disabled:bg-gray-50`}
          disabled={pending}
          onClick={fetchProducts}
          ref={nextButtonRef}
        >
          {pending ? 'Loading...' : 'Load more products'}
        </button>
      )}
    </>
  );
}
