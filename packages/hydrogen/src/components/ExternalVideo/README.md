<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/components/ExternalVideo and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/main/content/internal/operations/hydrogen-reference-docs.md. -->

The `ExternalVideo` component renders an embedded video for the Storefront
API's [`ExternalVideo` object](/api/storefront/reference/products/externalvideo).

## Example code

```tsx
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
    return <ExternalVideo video={firstMediaElement} />;
  }
}
```

## Props

| Name     | Type                                                                                    | Description                                                                                                                                                                                                                       |
| -------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| video    | <code>Pick<<wbr>ExternalVideoType, "host" &#124; "embeddedUrl" &#124; "id"<wbr>></code> | An object with the keys `host`, `embeddedUrl`, and `id`. Refer to the Storefront API's [`ExternalVideo` type](/api/storefront/reference/products/externalvideo).                                                                  |
| options? | <code>YouTube &#124; Vimeo</code>                                                       | An object containing the options available for either [YouTube](https://developers.google.com/youtube/player_parameters#Parameters) or [Vimeo](https://vimeo.zendesk.com/hc/en-us/articles/360001494447-Using-Player-Parameters). |

## Component type

The `ExternalVideo` component is a shared component, which means that it renders on both the server and the client. For more information about component types, refer to [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components).

## GraphQL fragment

The following fragment is available as a string for your GraphQL query using `ExternalVideoFragment` or `ExternalVideo.Fragment`. Using this fragment ensures that you have all the data you need for rendering the `ExternalVideo` component.

```graphql
fragment ExternalVideoFragment on ExternalVideo {
  id
  embeddedUrl
  host
}
```

## Related components

- [`MediaFile`](/api/hydrogen/components/primitive/mediafile)
