import {
  CacheLong,
  gql,
  Seo,
  useServerAnalytics,
  useShopQuery,
} from '@shopify/hydrogen';

/**
 * A server component that fetches a `shop.name` and sets default values and templates for every page on a website
 */
export function DefaultSeo() {
  const {
    data: {
      shop: {
        name,
        description,
        id,
        paymentSettings: {currencyCode},
      },
    },
  } = useShopQuery({
    query: SHOP_QUERY,
    cache: CacheLong(),
    preload: '*',
  });

  useServerAnalytics({
    shopify: {
      shopId: id,
      currency: currencyCode,
    },
  });

  return (
    <Seo
      type="defaultSeo"
      data={{
        title: name,
        description,
      }}
    />
  );
}

const SHOP_QUERY = gql`
  query shopInfo {
    shop {
      id
      name
      description
      paymentSettings {
        currencyCode
      }
    }
  }
`;
