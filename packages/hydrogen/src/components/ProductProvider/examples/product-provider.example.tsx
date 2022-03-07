import {ProductProvider} from '@shopify/hydrogen';
import {ProductProviderFragment} from '@shopify/hydrogen/fragments';
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
    <ProductProvider data={data.product}>{/* Your JSX */}</ProductProvider>
  );
}
