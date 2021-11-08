<!-- This file is generated from the source code. Edit the files in /packages/hydrogen/src/components/Image and run 'yarn generate-docs' at the root of this repo. -->

The `Image` component renders an image for the Storefront API's
[`Image` object](/api/storefront/reference/common-objects/image).

## Example code

```tsx
/** Storefront API images */

import {Image} from '@shopify/hydrogen';
import gql from 'graphql-tag';

const QUERY = gql`
  ${Image.Fragment}

  productByHandle(handle: "my-product") {
    images(first: 1) {
      edges {
        node {
          ...ImageFragment
        }
      }
    }
  }
`;

export default function Product() {
  const {data, fetching} = useShopQuery({query: QUERY});

  const image = data.productByHandle.images.edges[0].node;

  return <Image image={image} />;
}
```

```tsx
/** External images */

import {Image} from '@shopify/hydrogen';
export default function ExternalImage() {
  return <Image src="https://foo.com/logo.png" width={500} height={500} />;
}
```

```tsx
/** External images with a custom loader */

import {Image} from '@shopify/hydrogen';
const imageLoader = (src, options) => {
  const {width, height, scale} = options;
  return `https://foo.com/${src}?w=${width}&h=${height}&scale=${scale}`;
};
export default function ExternalImageWithLoader() {
  return (
    <Image
      src="fancyImage.png"
      width={500}
      height={500}
      loaderOptions={{scale: 2}}
    />
  );
}
```

## Component type

The `Image` component is a shared component, which means that it renders on both the server and the client. For more information about component types, refer to [React Server Components](/api/hydrogen/framework/react-server-components).

## GraphQL fragment

The following fragment is available as a string for your GraphQL queries using `ImageFragment` or `Image.Fragment`. Using this fragment ensures that you have all the data necessary for rendering the `Image` component.

```graphql
fragment ImageFragment on Image {
  id
  url
  altText
  width
  height
}
```

## Image size options

You can change the size and format of the image returned by the Shopify CDN.

| Key      | Description                                                                                             |
| -------- | ------------------------------------------------------------------------------------------------------- |
| `width`  | A string of the pixel width (for example, `100px`) or `original` for the original width of the image.   |
| `height` | A string of the pixel height (for example, `100px`) or `original` for the original height of the image. |
| `crop`   | Valid values: `top`, `bottom`, `left`, `right`, or `center`.                                            |
| `scale`  | Valid values: 2 or 3.                                                                                   |
| `format` | Valid values: `jpg` or `pjpg`.                                                                          |

## Related components

- [`MediaFile`](/api/hydrogen/components/primitive/mediafile)
