import {useShopQuery, Seo, CacheDays} from '@shopify/hydrogen';
import gql from 'graphql-tag';

/**
 * A server component that fetches a `shop.name` and sets default values and templates for every page on a website
 */
export default function DefaultSeo() {
  const {
    data: {
      shop: {name: shopName, description: shopDescription},
    },
  } = useShopQuery({
    query: QUERY,
    cache: CacheDays(),
    preload: '*',
  });

  return (
    <Seo
      type="defaultSeo"
      data={{
        title: shopName,
        description: shopDescription,
      }}
    />
  );
}

const QUERY = gql`
  query shopInfo {
    shop {
      name
      description
    }
  }
`;
