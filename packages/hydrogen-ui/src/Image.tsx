import * as React from 'react';
import {
  getShopifyImageDimensions,
  shopifyImageLoader,
  addImageSizeParametersToUrl,
  IMG_SRC_SET_SIZES,
} from './image-size.js';
import type {Image as ImageType} from './storefront-api-types.js';
import type {PartialDeep, Simplify, SetRequired} from 'type-fest';

type HtmlImageProps = React.ImgHTMLAttributes<HTMLImageElement>;

export type ShopifyLoaderOptions = {
  crop?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  scale?: 2 | 3;
  width?: HtmlImageProps['width'] | ImageType['width'];
  height?: HtmlImageProps['height'] | ImageType['height'];
};
export type ShopifyLoaderParams = Simplify<
  ShopifyLoaderOptions & {
    src: ImageType['url'];
  }
>;
export type ShopifyImageProps = Omit<HtmlImageProps, 'src'> & {
  /** An object with fields that correspond to the Storefront API's
   * [Image object](https://shopify.dev/api/storefront/reference/common-objects/image).
   * The `data` prop is required.
   */
  data: SetRequired<PartialDeep<ImageType>, 'url'>;
  /** A custom function that generates the image URL. Parameters passed in
   * are `ShopifyLoaderParams`
   */
  loader?: (params: ShopifyLoaderParams) => string;
  /** An object of `loader` function options. For example, if the `loader` function
   * requires a `scale` option, then the value can be a property of the
   * `loaderOptions` object (for example, `{scale: 2}`). The object shape is `ShopifyLoaderOptions`.
   */
  loaderOptions?: ShopifyLoaderOptions;
  /**
   * `src` isn't used, and should instead be passed as part of the `data` object
   */
  src?: never;
  /**
   * An array of pixel widths to overwrite the default generated srcset. For example, `[300, 600, 800]`.
   */
  widths?: (HtmlImageProps['width'] | ImageType['width'])[];
};

/**
 * The `Image` component renders an image for the Storefront API's
 * [Image object](https://shopify.dev/api/storefront/reference/common-objects/image) by using the `data` prop. You can [customize this component](https://shopify.dev/api/hydrogen/components#customizing-hydrogen-components) using passthrough props.
 *
 * An image's width and height are determined using the following priority list:
 * 1. The width and height values for the `loaderOptions` prop
 * 2. The width and height values for bare props
 * 3. The width and height values for the `data` prop
 *
 * If only one of `width` or `height` are defined, then the other will attempt to be calculated based on the image's aspect ratio,
 * provided that both `data.width` and `data.height` are available. If `data.width` and `data.height` aren't available, then the aspect ratio cannot be determined and the missing
 * value will remain as `null`
 */
export function Image({
  data,
  width,
  height,
  loading,
  loader = shopifyImageLoader,
  loaderOptions,
  widths,
  decoding = 'async',
  ...rest
}: ShopifyImageProps) {
  if (!data.url) {
    throw new Error(`<Image/>: the 'data' prop requires the 'url' property`);
  }

  if (__HYDROGEN_DEV__ && !data.altText && !rest.alt) {
    console.warn(
      `<Image/>: the 'data' prop should have the 'altText' property, or the 'alt' prop, and one of them should not be empty. ${`Image: ${
        data.id ?? data.url
      }`}`
    );
  }

  const {width: imgElementWidth, height: imgElementHeight} =
    getShopifyImageDimensions({
      data,
      loaderOptions,
      elementProps: {
        width,
        height,
      },
    });

  if (__HYDROGEN_DEV__ && (!imgElementWidth || !imgElementHeight)) {
    console.warn(
      `<Image/>: the 'data' prop requires either 'width' or 'data.width', and 'height' or 'data.height' properties. ${`Image: ${
        data.id ?? data.url
      }`}`
    );
  }

  let finalSrc = data.url;

  if (loader) {
    finalSrc = loader({
      ...loaderOptions,
      src: data.url,
      width: imgElementWidth,
      height: imgElementHeight,
    });
    if (typeof finalSrc !== 'string' || !finalSrc) {
      throw new Error(
        `<Image/>: 'loader' did not return a valid string. ${`Image: ${
          data.id ?? data.url
        }`}`
      );
    }
  }

  // determining what the intended width of the image is. For example, if the width is specified and lower than the image width, then that is the maximum image width
  // to prevent generating a srcset with widths bigger than needed or to generate images that would distort because of being larger than original
  const maxWidth =
    width && imgElementWidth && width < imgElementWidth
      ? width
      : imgElementWidth;
  const finalSrcset =
    rest.srcSet ??
    internalImageSrcSet({
      ...loaderOptions,
      widths,
      src: data.url,
      width: maxWidth,
      height: imgElementHeight,
      loader,
    });

  /* eslint-disable hydrogen/prefer-image-component */
  return (
    <img
      id={data.id ?? ''}
      alt={data.altText ?? rest.alt ?? ''}
      loading={loading ?? 'lazy'}
      {...rest}
      src={finalSrc}
      width={imgElementWidth ?? undefined}
      height={imgElementHeight ?? undefined}
      srcSet={finalSrcset}
      decoding={decoding}
    />
  );
  /* eslint-enable hydrogen/prefer-image-component */
}

type InternalShopifySrcSetGeneratorsParams = Simplify<
  ShopifyLoaderOptions & {
    src: ImageType['url'];
    widths?: (HtmlImageProps['width'] | ImageType['width'])[];
    loader?: (params: ShopifyLoaderParams) => string;
  }
>;
function internalImageSrcSet({
  src,
  width,
  crop,
  scale,
  widths,
  loader,
  height,
}: InternalShopifySrcSetGeneratorsParams) {
  const hasCustomWidths = widths && Array.isArray(widths);
  if (hasCustomWidths && widths.some((size) => isNaN(size as number))) {
    throw new Error(`<Image/>: the 'widths' must be an array of numbers`);
  }

  let aspectRatio = 1;
  if (width && height) {
    aspectRatio = Number(height) / Number(width);
  }

  let setSizes = hasCustomWidths ? widths : IMG_SRC_SET_SIZES;
  if (
    !hasCustomWidths &&
    width &&
    width < IMG_SRC_SET_SIZES[IMG_SRC_SET_SIZES.length - 1]
  ) {
    setSizes = IMG_SRC_SET_SIZES.filter((size) => size <= width);
  }
  const srcGenerator = loader ? loader : addImageSizeParametersToUrl;
  return setSizes
    .map(
      (size) =>
        `${srcGenerator({
          src,
          width: size,
          // height is not applied if there is no crop
          // if there is crop, then height is applied as a ratio of the original width + height aspect ratio * size
          height: crop ? Number(size) * aspectRatio : undefined,
          crop,
          scale,
        })} ${size}w`
    )
    .join(', ');
}
