import {gql, useShopQuery, CacheLong} from '@shopify/hydrogen';

export default function UseShopQueryExample() {
  /* use useShopQuery to fetch data from the Storefront API */

  const {data} = useShopQuery({
    query: QUERY,
    cache: CacheLong(), // https://shopify.dev/custom-storefronts/hydrogen/cache
    preload: true, // Defaults to true. https://shopify.dev/custom-storefronts/hydrogen/querying/preloaded-queries
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
