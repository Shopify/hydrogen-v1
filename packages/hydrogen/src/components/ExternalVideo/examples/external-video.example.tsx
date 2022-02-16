import {ExternalVideo} from '@shopify/hydrogen';
import gql from 'graphql-tag';

const QUERY = gql`
  ${ExternalVideo.Fragment}

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
                ... on ExternalVideo {
                  mediaContentType
                  ...ExternalVideoFragment
                }
              }
            }
          }
        }
      }
    }
  }
`;

export default function MyProductVideo() {
  const {data} = useShopQuery({query: QUERY});

  const firstMediaElement = data.products.edges[0].node.media.edges[0].node;
  if (firstMediaElement.mediaContentType === 'EXTERNAL_VIDEO') {
    return <ExternalVideo data={firstMediaElement} />;
  }
}
