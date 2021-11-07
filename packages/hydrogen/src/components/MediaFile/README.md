<!-- This file is generated from the source code. Edit the files in /packages/hydrogen/src/components/MediaFile and run 'yarn generate-docs' at the root of this repo. -->

The `MediaFile` component renders the media for the Storefront API's
[Media object](/api/storefront/reference/products/media). It renders an `Image`, a
`Video`, an `ExternalVideo`, or a `Model3D` depending on the `mediaContentType` of the
`media` provided as a prop.

## Example code

```tsx
import {MediaFile, useShopQuery} from '@shopify/hydrogen';
import gql from 'graphql-tag';

const QUERY = gql`
  ${MediaFile.Fragment}

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
        return <MediaFile media={product.node.media.edges[0].node} />;
      })}
    </ul>
  );
}
```

## Props

| Name     | Type                                                                                         | Description                                                                     |
| -------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| media    | <code>MediaImageMedia &#124; Model3DMedia &#124; ExternalVideoMedia &#124; VideoMedia</code> | A [Media object](/api/storefront/reference/products/media).                     |
| options? | <code>UndocumentedType &#124; UndocumentedType</code>                                        | The options for the `Image`, `Video`, `ExternalVideo`, or `Model3D` components. |

## Component type

The `MediaFile` component is a shared component, which means that it renders on both the server and the client. For more information about component types, refer to [React Server Components](/api/hydrogen/framework/react-server-components).

## GraphQL fragment

The following fragment is available as a string for your GraphQL query using `MediaFileFragment` or `MediaFile.Fragment`. Using this fragment ensures that you have all the data necessary for rendering the `MediaFile` component.

```graphql
fragment MediaFileFragment on Media {
  ... on MediaImage {
    mediaContentType
    image {
      ...ImageFragment
    }
  }
  ... on Video {
    mediaContentType
    ...VideoFragment
  }
  ... on ExternalVideo {
    mediaContentType
    ...ExternalVideoFragment
  }
  ... on Model3d {
    mediaContentType
    ...Model3DFragment
  }
}
```

## Related components

- [`Image`](/api/hydrogen/components/primitive/image)
- [`Video`](/api/hydrogen/components/primitive/video)
- [`ExternalVideo`](/api/hydrogen/components/primitive/externalvideo)
- [`Model3D`](/api/hydrogen/components/primitive/model3d)
