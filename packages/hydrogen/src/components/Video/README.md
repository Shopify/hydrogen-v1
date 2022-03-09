<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/components/Video and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/main/content/internal/operations/hydrogen-reference-docs.md. -->

The `Video` component renders a `video` for the Storefront API's [Video object](/api/storefront/reference/products/video).

## Example code

```tsx
import {Video} from '@shopify/hydrogen';
import {VideoFragment} from '@shopify/hydrogen/fragments';
import gql from 'graphql-tag';

const QUERY = gql`
  ${VideoFragment}
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
                  ...VideoFragment
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
```

## Props

| Name     | Type                               | Description                                                                                                       |
| -------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| data     | <code>VideoFragmentFragment</code> | An object with keys that correspond to the Storefront API's [Video object](/api/storefront/latest/objects/video). |
| options? | <code>ImageSizeOptions</code>      | An object of image size options for the video's `previewImage`.                                                   |

## Component type

The `Video` component is a shared component, which means that it renders on both the server and the client. For more information about component types, refer to [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components).

## GraphQL fragment

The following fragment is available as a string for your GraphQL queries using `VideoFragment` from `@shopify/hydrogen/fragments`. Using this fragment ensures that you have all the data necessary for rendering the `Video` component.

```graphql
fragment VideoFragment on Video {
  id
  previewImage {
    url
  }
  sources {
    mimeType
    url
  }
}
```

## Related components

- [`MediaFile`](/api/hydrogen/components/primitive/mediafile)
