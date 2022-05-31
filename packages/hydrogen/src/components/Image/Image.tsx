import * as React from 'react';
import {getShopifyImageDimensions, shopifyImageLoader} from '../../utilities';
import type {Image as ImageType} from '../../storefront-api-types';
import type {PartialDeep, Simplify, SetRequired} from 'type-fest';

type HtmlImageProps = React.ImgHTMLAttributes<HTMLImageElement>;

type ImageProps<GenericLoaderOpts> =
  | ShopifyImageProps
  | ExternalImageProps<GenericLoaderOpts>;

export function Image<GenericLoaderOpts>(props: ImageProps<GenericLoaderOpts>) {
  if (!props.data && !props.src) {
    throw new Error(`<Image/>: requires either a 'data' or 'src' prop.`);
  }

  if (__DEV__ && props.data && props.src) {
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
};

function ShopifyImage({
  data,
  width,
  height,
  loading,
  loader = shopifyImageLoader,
  loaderOptions,
  ...rest
}: ShopifyImageProps) {
  if (!data.url) {
    throw new Error(`<Image/>: the 'data' prop requires the 'url' property`);
  }

  if (__DEV__ && !data.altText && !rest.alt) {
    console.warn(
      `<Image/>: the 'data' prop should have the 'altText' property, or the 'alt' prop, and one of them should not be empty. ${`Image: ${
        data.id ?? data.url
      }`}`
    );
  }

  const {width: finalWidth, height: finalHeight} = getShopifyImageDimensions(
    data,
    loaderOptions
  );

  if ((__DEV__ && !finalWidth) || !finalHeight) {
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
      width: finalWidth,
      height: finalHeight,
    });
    if (typeof finalSrc !== 'string' || !finalSrc) {
      throw new Error(
        `<Image/>: 'loader' did not return a valid string. ${`Image: ${
          data.id ?? data.url
        }`}`
      );
    }
  }

  /* eslint-disable hydrogen/prefer-image-component */
  return (
    <img
      id={data.id ?? ''}
      alt={data.altText ?? rest.alt ?? ''}
      loading={loading ?? 'lazy'}
      {...rest}
      src={finalSrc}
      width={finalWidth ?? undefined}
      height={finalHeight ?? undefined}
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
type ExternalImageProps<GenericLoaderOpts> = SetRequired<
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
};

function ExternalImage<GenericLoaderOpts>({
  src,
  width,
  height,
  alt,
  loader,
  loaderOptions,
  loading,
  ...rest
}: ExternalImageProps<GenericLoaderOpts>) {
  if (!width || !height) {
    throw new Error(
      `<Image/>: when 'src' is provided, 'width' and 'height' are required and need to be valid values (i.e. greater than zero). Provided values: 'src': ${src}, 'width': ${width}, 'height': ${height}`
    );
  }

  if (__DEV__ && !alt) {
    console.warn(
      `<Image/>: when 'src' is provided, 'alt' should also be provided. ${`Image: ${src}`}`
    );
  }

  let finalSrc = src;

  if (loader) {
    finalSrc = loader({src, width, height, ...loaderOptions});
    if (typeof finalSrc !== 'string' || !finalSrc) {
      throw new Error(`<Image/>: 'loader' did not return a valid string`);
    }
  }

  /* eslint-disable hydrogen/prefer-image-component */
  return (
    <img
      {...rest}
      src={finalSrc}
      width={width}
      height={height}
      alt={alt ?? ''}
      loading={loading ?? 'lazy'}
    />
  );
  /* eslint-enable hydrogen/prefer-image-component */
}
