import {useQuery, CacheLong} from '@shopify/hydrogen';
import randomUser from '../lib/random-user';

export default function UseQueryExample() {
  /*
  Use useQuery when:
  - Calling 3P APIs using an SDK e.g. await cms.get('resource')
  - Making multile requests to 3P resources in parallel e.g. await Promise.all([Fetch(...), Fetch(...), etc])
  - Preloading 3P queries, e.g. product recommendations based on geo locations
  - Generally, when you need more flexibility to read 3p responses, or to implement something like retry-logic.
  */

  const {
    data: {
      name: {first, last},
    },
  } = useQuery(
    ['unique', 'key'], // A string or an array to uniquely identify the query.
    async () => {
      return await randomUser.get(); // Example 3P SDK
    },
    {
      cache: CacheLong(), // https://shopify.dev/custom-storefronts/hydrogen/querying/cache
      preload: true, // Defaults to true. https://shopify.dev/custom-storefronts/hydrogen/querying/preloaded-queries
    }
  );

  return <p>Random user: {`${first} ${last}`}</p>;
}
