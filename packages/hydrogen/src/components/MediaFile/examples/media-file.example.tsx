import {MediaFile, useShopQuery} from '@shopify/hydrogen';
import {MediaFileFragment} from '@shopify/hydrogen/fragments';
import gql from 'graphql-tag';

const QUERY = gql`
  ${MediaFileFragment}

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
        return <MediaFile data={product.node.media.edges[0].node} />;
      })}
    </ul>
  );
}
