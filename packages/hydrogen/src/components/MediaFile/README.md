<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/components/MediaFile and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/main/content/internal/operations/reference-docs/hydrogen.md. -->

The `MediaFile` component renders the media for the Storefront API's
[Media object](/api/storefront/reference/products/media). It renders an `Image`, a
`Video`, an `ExternalVideo`, or a `ModelViewer` depending on the `mediaContentType` of the
`media` provided as a prop.

## Example code

```tsx
import {MediaFile, useShopQuery} from '@shopify/hydrogen';
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
                ... on MediaImage {
                  mediaContentType
                  image {
                    id
                    url
                    altText
                    width
                    height
                  }
                }
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
                ... on ExternalVideo {
                  mediaContentType
                  id
                  embedUrl
                  host
                }
                ... on Model3d {
                  mediaContentType
                  id
                  alt
                  mediaContentType
                  previewImage {
                    url
                  }
                  sources {
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
```

## Props

| Name     | Type                                                                                                                                                                                                                           | Description                                                                                                             |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| data     | <code>PartialDeep&#60;MediaEdgeType['node']&#62;</code>                                                                                                                                                                        | An object with fields that correspond to the Storefront API's [Media object](/api/storefront/reference/products/media). |
| options? | <code>React.ComponentProps&#60;typeof Video&#62;['options']</code> &#124; <code>React.ComponentProps&#60;typeof ExternalVideo&#62;['options']</code> &#124; <code>React.ComponentProps&#60;typeof Image&#62;['options']</code> | The options for the `Image`, `Video`, or `ExternalVideo` components.                                                    |

## Component type

The `MediaFile` component is a shared component, which means that it renders on both the server and the client. For more information about component types, refer to [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components).

## Storefront API data

The `data` prop is an object with fields that correspond to the Storefront API's [Media object](/api/storefront/reference/products/media):

```graphql
{
  ... on MediaImage {
    mediaContentType
    image {
      id
      url
      altText
      width
      height
    }
  }
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
  ... on ExternalVideo {
    mediaContentType
    id
    embedUrl
    host
  }
  ... on Model3d {
    mediaContentType
    id
    alt
    mediaContentType
    previewImage {
      url
    }
    sources {
      url
    }
  }
}
```

## Related components

- [`Image`](/api/hydrogen/components/primitive/image)
- [`Video`](/api/hydrogen/components/primitive/video)
- [`ExternalVideo`](/api/hydrogen/components/primitive/externalvideo)
- [`ModelViewer`](/api/hydrogen/components/primitive/modelviewer)
