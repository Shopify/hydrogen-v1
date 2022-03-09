/** Storefront API images */

import {Image} from '@shopify/hydrogen';
import {ImageFragment} from '@shopify/hydrogen/fragments';
import gql from 'graphql-tag';

const QUERY = gql`
  ${ImageFragment}

  productByHandle(handle: "my-product") {
    featuredImage {
      ...ImageFragment
    }
  }
`;

export default function Product() {
  const {data} = useShopQuery({query: QUERY});

  const image = data.productByHandle.featuredImage;

  return <Image data={image} />;
}
