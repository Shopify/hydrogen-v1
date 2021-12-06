import {useShopQuery} from '@shopify/hydrogen';
import gql from 'graphql-tag';

import Seo from './Seo.client';

export default function DefaultSeo({helmetData}) {
  const {
    data: {
      shop: {name: shopName},
    },
  } = useShopQuery({
    query: QUERY,
    cache: {maxAge: 60 * 60 * 12, staleWhileRevalidate: 60 * 60 * 12},
  });

  return <Seo shopName={shopName} helmetData={helmetData} />;
}

const QUERY = gql`
  query shopName {
    shop {
      name
    }
  }
`;
