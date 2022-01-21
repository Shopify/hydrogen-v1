import {useShopQuery} from '@shopify/hydrogen';
import gql from 'graphql-tag';

import Seo from './Seo.client';

/**
 * A server component that fetches a `shop.name` and sets default values and templates for every page on a website
 */
export default function DefaultSeo() {
  const {
    data: {
      shop: {name: shopName},
    },
  } = useShopQuery({
    query: QUERY,
    cache: {maxAge: 60 * 60 * 12, staleWhileRevalidate: 60 * 60 * 12},
  });

  return <Seo shopName={shopName} />;
}

const QUERY = gql`
  query shopName {
    shop {
      name
    }
  }
`;
