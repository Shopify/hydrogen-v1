import {ProductProvider} from '@shopify/hydrogen';
import gql from 'graphql-tag';

const QUERY = gql`
  query product($handle: String!) {
    product: product(handle: $handle) {
      ...ProductProviderFragment
    }
  }

  ${ProductProviderFragment}
`;

export function Product() {
  const {data} = useShopQuery({query: QUERY});

  return (
    <ProductProvider product={data.product}>{/* Your JSX */}</ProductProvider>
  );
}
