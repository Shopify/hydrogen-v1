# Video


The `Video` component renders a video for the Storefront API's [Video object](https://shopify.dev/api/storefront/reference/products/video).

The component outputs a `video` element. You can [customize this component](/components#customizing-hydrogen-components) using passthrough props.

## Example code

```tsx
import {Video, gql} from '@shopify/hydrogen';

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
| data     | `PartialDeep&#60;VideoType&#62;` | An object with fields that correspond to the Storefront API's [Video object](https://shopify.dev/api/storefront/latest/objects/video). |
| previewImageOptions? | `ShopifyLoaderParams`               | An object of image size options for the video's `previewImage`. Uses `shopifyImageLoader` to generate the `poster` URL.                                                                       |
sourceProps | `HTMLAttributes<HtmlSourceElement> & {'data-testid'?: string}` | Props that will be passed to the `video` element's children `source` elements. |


## Required fields

The `Video` component requires the following fields from the Storefront API's
[Video object](https://shopify.dev/api/storefront/reference/products/video):

```graphql
{
  sources {
    url
    mimeType
  }
}
```

## Component type

The `Video` component is a shared component, which means that it renders on both the server and the client. For more information about component types, refer to [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/react-server-components).

## Related components

- [`MediaFile`](/components/primitive/mediafile/)
- [`Image`](/components/primitive/image/)
