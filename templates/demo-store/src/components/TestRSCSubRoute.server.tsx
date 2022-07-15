import {CacheLong, gql, useShopQuery} from '@shopify/hydrogen';

/**
 * A server component that fetches a `shop.name` and sets default values and templates for every page on a website
 */
export function TestRSCSubRoute() {
  console.log('TestRSCSubRoute');
  const {
    data: {
      shop: {name, description},
    },
  } = useShopQuery({
    query: SHOP_QUERY,
    cache: CacheLong(),
    preload: '*',
  });

  return (
    <p>
      {name}: {description}
    </p>
  );
}

const SHOP_QUERY = gql`
  query shopInfo {
    shop {
      name
      description
    }
  }
`;
