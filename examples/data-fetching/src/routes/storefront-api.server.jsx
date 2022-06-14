import {gql, useShopQuery, CacheHours} from '@shopify/hydrogen';

export default function UseShopQueryExample() {
  /* use useShopQuery to fetch data from the Storefront API */

  const {data} = useShopQuery({
    query: QUERY,
    cache: CacheHours(), // https://shopify.dev/custom-storefronts/hydrogen/framework/cache
    preload: true, // Defaults to true. https://shopify.dev/custom-storefronts/hydrogen/framework/preloaded-queries
  });
  return <p>Shop name: {data.shop.name}</p>;
}

const QUERY = gql`
  query ShopName {
    shop {
      name
    }
  }
`;
