import {fetchSync, CacheHours} from '@shopify/hydrogen';

export default function FetchSyncExample() {
  /* Use fetchSync when making a simple fetch call */

  const {results} = fetchSync('https://randomuser.me/api/', {
    cache: CacheHours(), // https://shopify.dev/custom-storefronts/hydrogen/framework/cache
    preload: true, // Defaults to true. https://shopify.dev/custom-storefronts/hydrogen/framework/preloaded-queries
  }).json();

  const {first, last} = results[0].name;
  return <p>Random user: {`${first} ${last}`}</p>;
}
