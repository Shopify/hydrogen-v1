---
gid: 244ea786-fafe-11eb-9a03-0242ac130003
title: Image
description: The Image component renders an image for the Storefront API's Image object.
---

The `Image` component renders an image for the Storefront API's
[Image object](https://shopify.dev/api/storefront/reference/common-objects/image). 

The component outputs an `<img>` element. You can [customize this component](https://shopify.dev/api/hydrogen/components#customizing-hydrogen-components) using passthrough props.

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
      loaderOptions={% raw %}{{scale: 2}}{% endraw %}
    />
  );
}
```

## Props

| Name           | Type                                             | Description                                                                                                                                                                                          |
| -------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| data           | <code>PartialDeep&#60;ImageType&#62;</code>      | An object with fields that correspond to the Storefront API's [Image object](https://shopify.dev/api/storefront/reference/common-objects/image). The `data` prop is required if `src` isn't used, but both props shouldn't be used at the same time. If both `src` and `data` are passed, then `data` takes priority.                                                     |
| src            | <code>string</code>                              | A URL string. This string can be an absolute path or a relative path depending on the `loader`. The `src` prop is required if `data` isn't used, but both props shouldn't be used at the same time. If both `src` and `data` are passed, then `data` takes priority.                                                                                                      |
| width          | <code>number &#124; string</code>                              | The integer or string value for the width of the image. This is a required prop when `src` is present.                                                                                                         |
| height         | <code>height &#124; string</code>                              | The integer or string value for the height of the image. This is a required prop when `src` is present.                                                                                                        |
| loader?        | <code>(props: ShopifyLoaderParams &#124; LoaderOptions) => string</code> | A custom function that generates the image URL. Parameters passed in are either `ShopifyLoaderParams` if using the `data` prop, or the `LoaderOptions` object that you pass to `loaderOptions`. |
| loaderOptions? | <code>ShopifyLoaderOptions &#124; LoaderOptions</code>       | An object of `loader` function options. For example, if the `loader` function requires a `scale` option, then the value can be a property of the `loaderOptions` object (for example, `{scale: 2}`). When the `data` prop is used, the object shape will be `ShopifyLoaderOptions`. When the `src` prop is used, the data shape is whatever you define it to be, and this shape will be passed to `loader`. |
| widths?         | <code>(number &#124; string)[]</code>                              | An array of pixel widths to overwrite the default generated srcset. For example, `[300, 600, 800]`. It only applies to images from Shopify CDN.   

## Required fields

When using the `data` prop, the `Image` component requires the following fields from the the Storefront API's
[Image object](https://shopify.dev/api/storefront/reference/common-objects/image).

```graphql
{
  url
  altText
  width
  height
}
```

## Component type

The `Image` component is a shared component, which means that it renders on both the server and the client. For more information about component types, refer to [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/framework/react-server-components).

## Image size options

You can change the size and format of the image returned by the Shopify CDN.

| Key      | Description                                                                                             |
| -------- | ------------------------------------------------------------------------------------------------------- |
| `width`  | A string of the pixel width (for example, `100px`) or `original` for the original width of the image.   |
| `height` | A string of the pixel height (for example, `100px`) or `original` for the original height of the image. |
| `crop`   | Valid values: `top`, `bottom`, `left`, `right`, or `center`.                                            |
| `scale`  | Valid values: 2 or 3.                                                                                   |

## Related components

- [`MediaFile`](https://shopify.dev/api/hydrogen/components/primitive/mediafile)
