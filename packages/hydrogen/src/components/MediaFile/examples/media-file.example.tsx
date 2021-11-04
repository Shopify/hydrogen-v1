import {MediaFile, useShopQuery} from '@shopify/hydrogen';
import gql from 'graphql-tag';

const QUERY = gql`
  ${MediaFile.Fragment}

  query Products {
    products(first: 5) {
      edges {
        node {
          id
          title
          handle
          media(first: 1) {
            edges {
              node {
                ...MediaFileFragment
              }
            }
          }
        }
      }
    }
  }
`;

export function MyComponent() {
  const {data} = useShopQuery({
    query: QUERY,
  });

  return (
    <ul>
      {data?.products?.map((product) => {
        return <MediaFile media={product.node.media.edges[0].node} />;
      })}
    </ul>
  );
}
