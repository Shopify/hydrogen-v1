import {
  CacheLong,
  gql,
  useShopQuery,
  type HydrogenRouteProps,
} from '@shopify/hydrogen';

/**
 * A server component that fetches a `shop.name` and sets default values and templates for every page on a website
 */
export default function TestRSCSubRoute({response}: HydrogenRouteProps) {
  response.cache(CacheLong());

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
    <p className="bg-contrast">
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
