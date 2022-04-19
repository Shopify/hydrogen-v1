import {useState} from 'react';
import ProductCard from './ProductCard';
import SpinnerIcon from './SpinnerIcon.client';

/**
 * A client component that provides functionality to initially show a subset of products and a button to load more products
 */
export default function LoadMoreProducts({cursor}) {
  const [nextCursor, setNextCursor] = useState(cursor);
  const [pages, setPages] = useState([]);
  const [pending, setPending] = useState(false);

  async function getNewProducts() {
    setPending(true);

    const url = new URL(window.location.href);
    url.searchParams.set('cursor', nextCursor);

    const {data} = await fetch(url, {
      method: 'POST',
    }).then((r) => r.json());
    setPages((pages) => {
      return pages.concat([
        data.collection.products.edges.map((edge) => edge.node),
      ]);
    });

    setNextCursor(data.collection.products.pageInfo.endCursor);
    setPending(false);
  }

  return (
    <>
      {pages.map((products) => {
        return products.map((product) => {
          return (
            <li key={product.title}>
              <ProductCard product={product} />
            </li>
          );
        });
      })}
      <li className="flex justify-center h-14">
        {pending ? (
          <SpinnerIcon />
        ) : (
          <button
            type="button"
            disabled={pending}
            className={`uppercase border-4 bg-white border-black text-black text-center px-5 py-3 font-mono font-bold drop-shadow-lg active:drop-shadow-none hover:bg-black hover:text-white hover:border-white ${
              pending ? 'opacity-50' : undefined
            }`}
            onClick={getNewProducts}
          >
            Load more
          </button>
        )}
      </li>
    </>
  );
}
