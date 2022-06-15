import {useState, useRef, useEffect, useCallback} from 'react';
import {flattenConnection} from '@shopify/hydrogen';

import {Grid, ProductCard} from '~/components';
import {getImageLoadingPriority} from '~/lib/const';

export function ProductGrid({collection, loadImageEagerCount}) {
  const nextButtonRef = useRef(null);
  const initialProducts = collection?.products?.nodes || [];
  const {hasNextPage, endCursor} = collection.products.pageInfo;
  const [products, setProducts] = useState(initialProducts);
  const [cursor, setCursor] = useState(endCursor);
  const [nextPage, setNextPage] = useState(hasNextPage);
  const [pending, setPending] = useState(false);

  const fetchProducts = useCallback(async () => {
    setPending(true);
    const url = new URL(window.location.href);
    url.searchParams.set('cursor', cursor);

    const response = await fetch(url, {method: 'POST'});
    const {data} = await response.json();

    // ProductGrid can paginate collections.products or products all routes
    const newProducts = flattenConnection(
      data?.collection?.products || data?.products || [],
    );
    const {endCursor, hasNextPage} = data?.collection?.products?.pageInfo ||
      data?.products?.pageInfo || {endCursor: '', hasNextPage: false};

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
        {products.map((product, i) => (
          <ProductCard
            key={product.id}
            product={product}
            loading={getImageLoadingPriority(i, loadImageEagerCount)}
          />
        ))}
      </Grid>

      {nextPage && (
        <button
          className={`bg-white border dark:text-black border-gray-50 font-medium p-2 disabled:bg-gray-50`}
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
