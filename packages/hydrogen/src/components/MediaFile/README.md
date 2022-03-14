<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/components/MediaFile and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/main/content/internal/operations/hydrogen-reference-docs.md. -->

The `MediaFile` component renders the media for the Storefront API's
[Media object](/api/storefront/reference/products/media). It renders an `Image`, a
`Video`, an `ExternalVideo`, or a `ModelViewer` depending on the `mediaContentType` of the
`media` provided as a prop.

## Example code

```tsx
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
```

## Props

| Name     | Type                                                | Description                                                                                                           |
| -------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | -------------------------------------------------------------------- |
| data     | <code>MediaFileFragmentFragment</code>              | An object with keys that correspond to the Storefront API's [Media object](/api/storefront/reference/products/media). |
| options? | <code>React.ComponentProps<typeof Video>['options'] | React.ComponentProps<typeof ExternalVideo>['options']                                                                 | React.ComponentProps<typeof Image>['options']</code> | The options for the `Image`, `Video`, or `ExternalVideo` components. |

## Component type

The `MediaFile` component is a shared component, which means that it renders on both the server and the client. For more information about component types, refer to [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components).

## GraphQL fragment

The following fragment is available as a string for your GraphQL query using `MediaFileFragment` from `@shopify/hydrogen/fragments`. Using this fragment ensures that you have all the data necessary for rendering the `MediaFile` component.

```graphql
fragment MediaFileFragment on Media {
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
