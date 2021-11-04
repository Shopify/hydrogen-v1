/** Storefront API images */

import {Image} from '@shopify/hydrogen';
import gql from 'graphql-tag';

const QUERY = gql`
  ${Image.Fragment}

  productByHandle(handle: "my-product") {
    images(first: 1) {
      edges {
        node {
          ...ImageFragment
        }
      }
    }
  }
`;

export default function Product() {
  const {data, fetching} = useShopQuery({query: QUERY});

  const image = data.productByHandle.images.edges[0].node;

  return <Image image={image} />;
}
