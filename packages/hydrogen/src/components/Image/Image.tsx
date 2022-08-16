import * as React from 'react';
import {
  getShopifyImageDimensions,
  shopifyImageLoader,
  addImageSizeParametersToUrl,
  IMG_SRC_SET_SIZES,
} from '../../utilities/index.js';
import type {Image as ImageType} from '../../storefront-api-types.js';
import type {PartialDeep, Simplify, SetRequired} from 'type-fest';

type HtmlImageProps = React.ImgHTMLAttributes<HTMLImageElement>;

type ImageProps<GenericLoaderOpts> =
  | ShopifyImageProps
  | ExternalImageProps<GenericLoaderOpts>;

/**
 * The `Image` component renders an image for the Storefront API's
 * [Image object](https://shopify.dev/api/storefront/reference/common-objects/image) by using the `data` prop, or a custom location by using the `src` prop. You can [customize this component](https://shopify.dev/api/hydrogen/components#customizing-hydrogen-components) using passthrough props.
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
export function Image<GenericLoaderOpts>(props: ImageProps<GenericLoaderOpts>) {
  if (!props.data && !props.src) {
    throw new Error(`<Image/>: requires either a 'data' or 'src' prop.`);
  }

  if (__HYDROGEN_DEV__ && props.data && props.src) {
    console.warn(
      `<Image/>: using both 'data' and 'src' props is not supported; using the 'data' prop by default`
    );
  }

  if (props.data) {
    return <ShopifyImage {...props} />;
  } else {
    return <ExternalImage {...props} />;
  }
}

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
   * The `data` prop is required if `src` isn't used, but both props shouldn't be used
   * at the same time. If both `src` and `data` are passed, then `data` takes priority.
   */
  data: SetRequired<PartialDeep<ImageType>, 'url'>;
  /** A custom function that generates the image URL. Parameters passed in
   * are either `ShopifyLoaderParams` if using the `data` prop, or the
   * `LoaderOptions` object that you pass to `loaderOptions`.
   */
  loader?: (params: ShopifyLoaderParams) => string;
  /** An object of `loader` function options. For example, if the `loader` function
   * requires a `scale` option, then the value can be a property of the
   * `loaderOptions` object (for example, `{scale: 2}`). When the `data` prop
   * is used, the object shape will be `ShopifyLoaderOptions`. When the `src`
   * prop is used, the data shape is whatever you define it to be, and this shape
   * will be passed to `loader`.
   */
  loaderOptions?: ShopifyLoaderOptions;
  /**
   * 'src' shouldn't be passed when 'data' is used.
   */
  src?: never;
  /**
   * An array of pixel widths to overwrite the default generated srcset. For example, `[300, 600, 800]`.
   */
  widths?: (HtmlImageProps['width'] | ImageType['width'])[];
};

function ShopifyImage({
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

type LoaderProps<GenericLoaderOpts> = {
  /** A URL string. This string can be an absolute path or a relative path depending
   * on the `loader`. The `src` prop is required if `data` isn't used, but both
   * props shouldn't be used at the same time. If both `src` and `data` are passed,
   * then `data` takes priority.
   */
  src: HtmlImageProps['src'];
  /** The integer or string value for the width of the image. This is a required prop
   * when `src` is present.
   */
  width: HtmlImageProps['width'];
  /** The integer or string value for the height of the image. This is a required prop
   * when `src` is present.
   */
  height: HtmlImageProps['height'];
  /** An object of `loader` function options. For example, if the `loader` function
   * requires a `scale` option, then the value can be a property of the
   * `loaderOptions` object (for example, `{scale: 2}`). When the `data` prop
   * is used, the object shape will be `ShopifyLoaderOptions`. When the `src`
   * prop is used, the data shape is whatever you define it to be, and this shape
   * will be passed to `loader`.
   */
  loaderOptions?: GenericLoaderOpts;
};
export type ExternalImageProps<GenericLoaderOpts> = SetRequired<
  HtmlImageProps,
  'src' | 'width' | 'height' | 'alt'
> & {
  /** A custom function that generates the image URL. Parameters passed in
   * are either `ShopifyLoaderParams` if using the `data` prop, or the
   * `LoaderOptions` object that you pass to `loaderOptions`.
   */
  loader?: (params: LoaderProps<GenericLoaderOpts>) => string;
  /** An object of `loader` function options. For example, if the `loader` function
   * requires a `scale` option, then the value can be a property of the
   * `loaderOptions` object (for example, `{scale: 2}`). When the `data` prop
   * is used, the object shape will be `ShopifyLoaderOptions`. When the `src`
   * prop is used, the data shape is whatever you define it to be, and this shape
   * will be passed to `loader`.
   */
  loaderOptions?: GenericLoaderOpts;
  /**
   * 'data' shouldn't be passed when 'src' is used.
   */
  data?: never;
  /**
   * An array of pixel widths to generate a srcset. For example, `[300, 600, 800]`.
   */
  widths?: HtmlImageProps['width'][];
};

function ExternalImage<GenericLoaderOpts>({
  src,
  width,
  height,
  alt,
  loader,
  loaderOptions,
  widths,
  loading,
  decoding = 'async',
  ...rest
}: ExternalImageProps<GenericLoaderOpts>) {
  if (!width || !height) {
    throw new Error(
      `<Image/>: when 'src' is provided, 'width' and 'height' are required and need to be valid values (i.e. greater than zero). Provided values: 'src': ${src}, 'width': ${width}, 'height': ${height}`
    );
  }

  if (__HYDROGEN_DEV__ && !alt) {
    console.warn(
      `<Image/>: when 'src' is provided, 'alt' should also be provided. ${`Image: ${src}`}`
    );
  }

  if (
    widths &&
    Array.isArray(widths) &&
    widths.some((size) => isNaN(size as number))
  )
    throw new Error(
      `<Image/>: the 'widths' property must be an array of numbers`
    );

  let finalSrc = src;

  if (loader) {
    finalSrc = loader({src, width, height, ...loaderOptions});
    if (typeof finalSrc !== 'string' || !finalSrc) {
      throw new Error(`<Image/>: 'loader' did not return a valid string`);
    }
  }
  let finalSrcset = rest.srcSet ?? undefined;

  if (!finalSrcset && loader && widths) {
    // Height is a requirement in the LoaderProps, so  to keep the aspect ratio, we must determine the height based on the default values
    const heightToWidthRatio =
      parseInt(height.toString()) / parseInt(width.toString());
    finalSrcset = widths
      ?.map((width) => parseInt(width as string, 10))
      ?.map(
        (width) =>
          `${loader({
            ...loaderOptions,
            src,
            width,
            height: Math.floor(width * heightToWidthRatio),
          })} ${width}w`
      )
      .join(', ');
  }

  /* eslint-disable hydrogen/prefer-image-component */
  return (
    <img
      {...rest}
      src={finalSrc}
      // @ts-expect-error TS doesn't understand that it could exist
      width={loaderOptions?.width ?? width}
      // @ts-expect-error TS doesn't understand that it could exist
      height={loaderOptions?.height ?? height}
      alt={alt ?? ''}
      loading={loading ?? 'lazy'}
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
