import {ProductsList} from '~/components/ProductsList.server';
import {CacheNone, CacheLong} from '@shopify/hydrogen';
import {Suspense} from 'react';

export default function Home({request, response, ...props}) {
  response.cache(CacheLong());
  return (
    <div>
      <h2>Products</h2>
      <hr />
      <Suspense fallback={'Loading products list..'}>
        <ProductsList />
      </Suspense>
    </div>
  );
}
