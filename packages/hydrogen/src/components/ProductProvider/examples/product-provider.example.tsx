import {ProductProvider} from '@shopify/hydrogen';
import gql from 'graphql-tag';

const QUERY = gql`
  query product($handle: String!) {
    product: productByHandle(handle: $handle) {
      ...ProductProviderFragment
    }
  }

  ${ProductProviderFragment}
`;


export function Product() {
  const {data} = useShopQuery({query: QUERY})

  return (
    <ProductProvider value={data.product.product}>
      {/* Your JSX */}
    </ProductProvider>
  )
}
