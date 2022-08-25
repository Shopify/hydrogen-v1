---
gid: 1e35ff3e-fafe-11eb-9a03-0242ac130003
title: ExternalVideo
description: The ExternalVideo component renders an embedded video for the Storefront API's ExternalVideo object.
---

The `ExternalVideo` component renders an embedded video for the Storefront
API's [ExternalVideo object](https://shopify.dev/api/storefront/reference/products/externalvideo).

The component outputs an `<iframe>` element. You can [customize this component](https://shopify.dev/api/hydrogen/components#customizing-hydrogen-components) using passthrough props.

## Example code

```tsx
import {ExternalVideo, gql} from '@shopify/hydrogen';

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
                ... on ExternalVideo {
                  id
                  embedUrl
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
    return <ExternalVideo data={firstMediaElement} />;
  }
}
```

## Props

| Name     | Type                                                | Description                                                                                                                                                                                                                       |
| -------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| data     | <code>PartialDeep&#60;ExternalVideoType&#62;</code> | An object with fields that correspond to the Storefront API's [ExternalVideo object](https://shopify.dev/api/storefront/reference/products/externalvideo).                                                                        |
| options? | <code>YouTube &#124; Vimeo</code>                   | An object containing the options available for either [YouTube](https://developers.google.com/youtube/player_parameters#Parameters) or [Vimeo](https://vimeo.zendesk.com/hc/en-us/articles/360001494447-Using-Player-Parameters). |
| frameBorder | Refer to the [MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#attr-frameborder) for more information.| Defaults to `'0'`. |
| allow | Refer to the [MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#attr-allow) for more information. | Defaults to `'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'`. |
| allowFullScreen |Refer to the [MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#attr-allowfullscreen) for more information. | Defaults to `'true'`. |
| loading |Refer to the [MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#attr-loading) for more information.| Defaults to `'lazy'`.  |

## Required fields

The `ExternalVideo` component requires the following field from the Storefront API's [ExternalVideo object](https://shopify.dev/api/storefront/reference/products/externalvideo):

```graphql
{
  embedUrl
}
```


## Component type

The `ExternalVideo` component is a shared component, which means that it renders on both the server and the client. For more information about component types, refer to [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/framework/react-server-components).

## Related components

- [`MediaFile`](https://shopify.dev/api/hydrogen/components/primitive/mediafile)
