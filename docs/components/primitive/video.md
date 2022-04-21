---
gid: c0d06be4-fafe-11eb-9a03-0242ac130003
title: Video
description: The Video component renders a video for the Storefront API's Video object.
---

The `Video` component renders a `video` for the Storefront API's [Video object](https://shopify.dev/api/storefront/reference/products/video).

## Example code

```tsx
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
```

## Props

| Name     | Type                                        | Description                                                                                                                            |
| -------- | ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| data     | <code>PartialDeep&#60;VideoType&#62;</code> | An object with fields that correspond to the Storefront API's [Video object](https://shopify.dev/api/storefront/latest/objects/video). |
| options? | <code>ImageSizeOptions</code>               | An object of image size options for the video's `previewImage`.                                                                        |

## Component type

The `Video` component is a shared component, which means that it renders on both the server and the client. For more information about component types, refer to [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/framework/react-server-components).

## Storefront API data

The `data` prop is an object with fields that correspond to the Storefront API's [Video object](https://shopify.dev/api/storefront/latest/objects/video):

```graphql
{
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

- [`MediaFile`](https://shopify.dev/api/hydrogen/components/primitive/mediafile)
