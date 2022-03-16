import {Video} from '@shopify/hydrogen';
import gql from 'graphql-tag';

const QUERY = gql`
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
                ... on Video {
                  mediaContentType
                  id
                  previewImage {
                    url
                  }
                  sources {
                    mimeType
                    url
                  }
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
  if (firstMediaElement.mediaContentType === 'VIDEO') {
    return <Video data={firstMediaElement} />;
  }
}
