import * as React from 'react';
import type {Image as ImageType} from '../../storefront-api-types';
import type {PartialDeep, Merge, MergeExclusive, Simplify} from 'type-fest';

type BaseImageProps = {
  /**
   * Whether the image will be immediately loaded. Defaults to `false`. This prop should be used only when
   * the image is visible above the fold. For more information, refer to the
   * [Image Embed element's loading attribute](https://developer.mozilla.org/enUS/docs/Web/HTML/Element/img#attr-loading).
   */
  priority?: boolean;
};

type HtmlElementProps = React.ImgHTMLAttributes<HTMLImageElement>;

type ImageProps<GenericLoaderOpts> = Simplify<
  MergeExclusive<SFApiProps, SrcProps<GenericLoaderOpts>>
>;

export function Image<GenericLoaderOpts>(props: ImageProps<GenericLoaderOpts>) {
  if (!props.data && !props.src) {
    throw new Error(`<Image/>: requires either a 'data' or 'src' prop.`);
  }

  if (props.data && props.src) {
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

type ShopifyLoaderOptions = {
  crop?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  scale?: 2 | 3;
  width?: number;
  height?: number;
};
type SFApiBaseProps = Merge<
  BaseImageProps,
  {
    /** An object with fields that correspond to the Storefront API's
     * [Image object](https://shopify.dev/api/storefront/reference/common-objects/image).
     */
    data: PartialDeep<ImageType>;
    /** A custom function that generates the image URL. Parameters passed into this function includes
     * `src` and an `options` object that contains the provided `width`, `height` and `loaderOptions` values.
     */
    loader?: (
      src: string,
      width: number,
      height: number,
      loaderOptions?: ShopifyLoaderOptions
    ) => string;
    /** An object of `loader` function options. For example, if the `loader` function requires a `scale` option,
     * then the value can be a property of the `loaderOptions` object (for example, `{scale: 2}`).
     */
    loaderOptions?: ShopifyLoaderOptions;
  }
>;
type SFApiProps = Merge<HtmlElementProps, SFApiBaseProps>;

function ShopifyImage({
  data,
  width,
  height,
  priority,
  loader,
  loaderOptions,
  ...rest
}: SFApiProps) {
  if (!data.url) {
    throw new Error(`<Image/>: the 'data' prop requires the 'url' property`);
  }

  if (!data.altText && !rest.alt) {
    console.warn(
      `<Image/>: the 'data' prop should have the 'altText' property, or the 'alt' prop, and one of them should not be empty. ${
        data.id ? `Image ID: ${data.id}` : ''
      }`
    );
  }

  const finalWidth = parseInt(`${width}` ?? data.width);
  const finalHeight = parseInt(`${height}` ?? data.height);
  let finalSrc = data.url;

  if (loader) {
    finalSrc = loader(data.url, finalWidth, finalHeight, loaderOptions);
  }

  if (!finalWidth || !finalHeight) {
    throw new Error(
      `<Image/>: the 'data' prop requires either 'width' or 'data.width', and 'height' or 'data.height' properties`
    );
  }

  /* eslint-disable hydrogen/prefer-image-component */
  return (
    <img
      {...rest}
      src={finalSrc}
      alt={data.altText ?? rest.alt ?? ''}
      width={finalWidth}
      height={finalHeight}
      loading={priority ? 'eager' : rest.loading ? rest.loading : 'lazy'}
    />
  );
  /* eslint-enable hydrogen/prefer-image-component */
}

type SrcBaseProps<GenericLoaderOpts> = Merge<
  BaseImageProps,
  {
    src: string;
    width: number;
    height: number;
    /** A custom function that generates the image URL. Parameters passed into this function includes
     * `src` and an `options` object that contains the provided `width`, `height` and `loaderOptions` values.
     */
    loader?: (
      src: string,
      width: number,
      height: number,
      loaderOptions?: GenericLoaderOpts
    ) => string;
    /** An object of `loader` function options. For example, if the `loader` function requires a `scale` option,
     * then the value can be a property of the `loaderOptions` object (for example, `{scale: 2}`).
     */
    loaderOptions?: GenericLoaderOpts;
  }
>;
type SrcProps<GenericLoaderOpts> = Merge<
  HtmlElementProps,
  SrcBaseProps<GenericLoaderOpts>
>;
function ExternalImage<GenericLoaderOpts>({
  src,
  width,
  height,
  alt,
  loader,
  loaderOptions,
  priority,
  ...rest
}: SrcProps<GenericLoaderOpts>) {
  if (!width || !height) {
    throw new Error(
      `<Image/>: when 'src' is provided, 'width' and 'height' are required and need to be valid values (i.e. greater than zero). Provided values: 'src': ${src}, 'width': ${width}, 'height': ${height}`
    );
  }

  if (!alt) {
    console.warn(
      `<Image/>: when 'src' is provided, 'alt' should also be provided`
    );
  }

  let finalSrc = src;

  if (loader) {
    finalSrc = loader(src, width, height, loaderOptions);
  }

  /* eslint-disable hydrogen/prefer-image-component */
  return (
    <img
      {...rest}
      src={finalSrc}
      width={width}
      height={height}
      alt={alt ?? ''}
      loading={priority ? 'eager' : rest.loading ? rest.loading : 'lazy'}
    />
  );
  /* eslint-enable hydrogen/prefer-image-component */
}
