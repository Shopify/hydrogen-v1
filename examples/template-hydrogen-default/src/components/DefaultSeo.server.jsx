import {useShopQuery} from '@shopify/hydrogen';
import gql from 'graphql-tag';

import DefaultSeoClient from './DefaultSeo.client';

/**
 * A server component that fetches a `shop.name` and sets default values and templates for every page on a website
 */
export default function DefaultSeo() {
  const {
    data: {
      shop: {
        name: shopName,
        description: shopDescription,
        primaryDomain: {url: shopUrl},
      },
    },
  } = useShopQuery({
    query: QUERY,
    cache: {maxAge: 60 * 60 * 12, staleWhileRevalidate: 60 * 60 * 12},
  });

  return (
    <DefaultSeoClient
      shopName={shopName}
      shopDescription={shopDescription}
      shopUrl={shopUrl}
    />
  );
}

const QUERY = gql`
  query shopName {
    shop {
      name
      description
      primaryDomain {
        url
      }
    }
  }
`;
