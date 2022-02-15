import {
  MediaFileFragment,
  flattenConnection,
  MediaFile,
  useShopQuery,
  MediaFile,
} from '@shopify/hydrogen/client';
import gql from 'graphql-tag';

const QUERY = gql`
  query product($handle: String!) {
    product: productByHandle(handle: $handle) {
      media(first: 10) {
        edges {
          node {
            ...MediaFileFragment
          }
        }
      }
    }
  }
  ${MediaFileFragment}
`;
export function Product({handle}) {
  const {data} = useShopQuery({query: QUERY, variables: {handle}});
  const media = flattenConnection(data.product.media);
  return (
    <>
      {media.map((mediaFile) => {
        return <MediaFile data={mediaFile} key={mediaFile.id} />;
      })}
    </>
  );
}
