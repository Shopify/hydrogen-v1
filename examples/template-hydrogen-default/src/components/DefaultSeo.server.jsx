import {useShopQuery, Seo} from '@shopify/hydrogen';
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
    cache: {maxAge: 60 * 60 * 12, staleWhileRevalidate: 60 * 60 * 12},
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
