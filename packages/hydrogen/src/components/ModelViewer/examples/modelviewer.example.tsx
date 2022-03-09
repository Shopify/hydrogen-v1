import {ModelViewer} from '@shopify/hydrogen';
import {Model3DFragment} from '@shopify/hydrogen/fragments';
import gql from 'graphql-tag';

const QUERY = gql`
  ${Model3DFragment}

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
                ... on Model3D {
                  mediaContentType
                  ...Model3DFragment
                }
              }
            }
          }
        }
      }
    }
  }
`;

export default function MyProductModel() {
  const {data} = useShopQuery({query: QUERY});

  const firstMediaElement = data.products.edges[0].node.media.edges[0].node;
  if (firstMediaElement.mediaContentType === 'MODEL_3D') {
    return <ModelViewer data={firstMediaElement} />;
  }
}
