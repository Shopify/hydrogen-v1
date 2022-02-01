import {useShopQuery, Seo, useServerRequest} from '@shopify/hydrogen';
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

  const {url} = useServerRequest();

  return (
    <Seo
      type="defaultSeo"
      data={{
        url,
        title: shopName,
        description: shopDescription,
      }}
    />
  );
}

const QUERY = gql`
  query shopName {
    shop {
      name
      description
    }
  }
`;
