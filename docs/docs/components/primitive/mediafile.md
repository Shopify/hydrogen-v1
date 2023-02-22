# MediaFile


The `MediaFile` component renders the media for the Storefront API's
[Media object](https://shopify.dev/api/storefront/reference/products/media). It renders an [`Image`](/components/primitive/image/), a
[`Video`](/components/primitive/video/), an [`ExternalVideo`](/components/primitive/externalvideo/), or a [`ModelViewer`](/components/primitive/modelviewer/) depending on the `mediaContentType` of the
`media` provided as a prop.

The component outputs the HTML element that corresponds to the rendered Hydrogen component. You can [customize this component](/components#customizing-hydrogen-components) using passthrough props.

## Example code

```tsx
import {MediaFile, useShopQuery, gql} from '@shopify/hydrogen';

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

| Name     | Type                                                                                                                                                                                                                           | Description                                                                                                                                |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| data     | `PartialDeep&#60;MediaEdgeType['node']&#62;`                                                                                                                                                                        | An object with fields that correspond to the Storefront API's [Media object](https://shopify.dev/api/storefront/reference/products/media). |
| options? | `React.ComponentProps&#60;typeof Video&#62;['options']` &#124; `React.ComponentProps&#60;typeof ExternalVideo&#62;['options']` &#124; `React.ComponentProps&#60;typeof Image&#62;['options']` | The options for the `Image`, `Video`, or `ExternalVideo` components.                                                                       |

## Required fields

The `MediaFile` component requires the following field from the Storefront API's
[Media object](https://shopify.dev/api/storefront/reference/products/media), as well as additional fields depending on the type of media. Refer to [`Image`](/components/primitive/image/),
[`Video`](/components/primitive/video/), [`ExternalVideo`](/components/primitive/externalvideo/), and [`ModelViewer`](/components/primitive/modelviewer/) for additional required fields.

```graphql
{
  mediaContentType
}
```

## Component type

The `MediaFile` component is a shared component, which means that it renders on both the server and the client. For more information about component types, refer to [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/react-server-components).

## Related components

- [`Image`](/components/primitive/image/)
- [`Video`](/components/primitive/video/)
- [`ExternalVideo`](/components/primitive/externalvideo/)
- [`ModelViewer`](/components/primitive/modelviewer/)
