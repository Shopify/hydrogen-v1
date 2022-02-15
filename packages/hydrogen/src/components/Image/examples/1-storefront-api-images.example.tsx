/** Storefront API images */

import {Image} from '@shopify/hydrogen';
import gql from 'graphql-tag';

const QUERY = gql`
  ${Image.Fragment}

  productByHandle(handle: "my-product") {
    featuredImage {
      ...ImageFragment
    }
  }
`;

export default function Product() {
  const {data} = useShopQuery({query: QUERY});

  const image = data.productByHandle.featuredImage;

  return <Image image={image} />;
}
