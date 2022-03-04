import {
  parseMetafieldValue,
  Metafield,
  MetafieldFragment,
  flattenConnection,
  useShopQuery,
  Metafield,
} from '@shopify/hydrogen/client';
import gql from 'graphql-tag';

const QUERY = gql`
  query product($handle: String!) {
    product: productByHandle(handle: $handle) {
      metafields(first: 10) {
        edges {
          node {
            ...MetafieldFragment
          }
        }
      }
    }
  }

  ${MetafieldFragment}
`;

export function Product({handle}) {
  const {data} = useShopQuery({query: QUERY, variables: {handle}});

  const metafields = flattenConnection(data.product.metafields);
  const parsedMetafields = metafields.map((metafield) =>
    parseMetafieldValue(metafield)
  );

  return (
    <>
      {parsedMetafields.map((metafield) => {
        return <Metafield data={metafield} key={metafield.id} />;
      })}
    </>
  );
}
