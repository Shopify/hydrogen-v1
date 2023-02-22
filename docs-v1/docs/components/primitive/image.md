# Image


The `Image` component renders an image for the Storefront API's [Image object](https://shopify.dev/api/storefront/reference/common-objects/image) by using the `data` prop, or a custom location by using the `src` prop.

The component outputs an `<img>` element. You can [customize this component](/components#customizing-hydrogen-components) using passthrough props.

An image's width and height are determined using the following priority list:

1. The width and height values for the `loaderOptions` prop
2. The width and height values for bare props
3. The width and height values for the `data` prop

If only one of `width` or `height` are defined, then the other will attempt to be calculated based on the image's aspect ratio, provided that both `data.width` and `data.height` are available. If `data.width` and `data.height` aren't available, then the aspect ratio can't be determined and the missing value will be `null`.

## Example code

```tsx
/** Storefront API images */

import {Image, gql} from '@shopify/hydrogen';

const QUERY = gql`
  productByHandle(handle: "my-product") {
    featuredImage {
      id
      url
      altText
      width
      height
    }
  }
`;

export default function Product() {
  const {data} = useShopQuery({query: QUERY});

  const image = data.productByHandle.featuredImage;

  return <Image data={image} />;
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
const imageLoader = ({src, width, height, scale}) => {
  return `https://foo.com/${src}?w=${width}&h=${height}&scale=${scale}`;
};
export default function ExternalImageWithLoader() {
  return (
    <Image
      src="fancyImage.png"
      width={500}
      height={500}
      loader={imageLoader}
      loaderOptions={{scale: 2}}
    />
  );
}
```

## Props

| Name           | Type                                             | Description                                                                                                                                                                                          |
| -------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| data           | `PartialDeep&#60;ImageType&#62;`      | An object with fields that correspond to the Storefront API's [Image object](https://shopify.dev/api/storefront/reference/common-objects/image). The `data` prop is required if `src` isn't used, but both props shouldn't be used at the same time. If both `src` and `data` are passed, then `data` takes priority.                                                     |
| src            | `string`                              | A URL string. This string can be an absolute path or a relative path depending on the `loader`. The `src` prop is required if `data` isn't used, but both props shouldn't be used at the same time. If both `src` and `data` are passed, then `data` takes priority.                                                                                                      |
| width          | `number &#124; string`                              | The integer or string value for the width of the image. This is a required prop when `src` is present.                                                                                                         |
| height         | `height &#124; string`                              | The integer or string value for the height of the image. This is a required prop when `src` is present.                                                                                                        |
| loader?        | `(props: ShopifyLoaderParams &#124; LoaderOptions) => string` | A custom function that generates the image URL. Parameters passed in are either `ShopifyLoaderParams` if using the `data` prop, or the `LoaderOptions` object that you pass to `loaderOptions`. |
| loaderOptions? | `ShopifyLoaderOptions &#124; LoaderOptions`       | An object of `loader` function options. For example, if the `loader` function requires a `scale` option, then the value can be a property of the `loaderOptions` object (for example, `{scale: 2}`). When the `data` prop is used, the object shape will be `ShopifyLoaderOptions`. When the `src` prop is used, the data shape is whatever you define it to be, and this shape will be passed to `loader`. |
| widths?         | `(number &#124; string)[]`                              | An array of pixel widths to overwrite the default-generated `srcset`. For example, `[300, 600, 800]`. This prop only applies to images from Shopify CDN.
| decoding?         | `('async' &#124; 'sync' &#124; 'auto')`                              | The decoding property of the `HTMLImageElement` interface represents a hint given to the browser on how to decode the image. Defaults to `async` .

## Required fields

When using the `data` prop, the `Image` component requires the following fields from the Storefront API's
[Image object](https://shopify.dev/api/storefront/reference/common-objects/image):

```graphql
{
  url
  altText
  width
  height
}
```

## Component type

The `Image` component is a shared component, which means that it renders on both the server and the client. For more information about component types, refer to [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/react-server-components).

## Image size options

You can change the size and format of the image returned by the Shopify CDN.

| Key      | Description                                                                                             |
| -------- | ------------------------------------------------------------------------------------------------------- |
| `width`  | The integer or string value for the pixel width of the image. For example, `100px`. This is a required prop when `src` is present.  |
| `height` | The integer or string value for the pixel height of the image. For example, `100px`. This is a required prop when `src` is present. |
| `crop`   | Valid values: `top`, `bottom`, `left`, `right`, or `center`.                                            |
| `scale`  | Valid values: 2 or 3.                                                                                   |

## Related components

- [`MediaFile`](/components/primitive/mediafile/)
