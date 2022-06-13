import {
  useShopQuery,
  Seo,
  CacheDays,
  useServerAnalytics,
  gql,
} from '@shopify/hydrogen';

/**
 * A server component that fetches a `shop.name` and sets default values and templates for every page on a website
 */
export default function DefaultSeo() {
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
    query: QUERY,
    cache: CacheDays(),
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

const QUERY = gql`
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
