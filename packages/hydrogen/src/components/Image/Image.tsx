import React from 'react';
import {
  ImageSizeOptions,
  ImageLoaderOptions,
  shopifyImageLoader,
  getShopifyImageDimensions,
} from '../../utilities';
import type {Image as ImageType} from '../../storefront-api-types';
import type {PartialDeep, Merge, MergeExclusive} from 'type-fest';
import {Image as Image2} from './Image2';

export interface BaseImageProps {
  /** A custom function that generates the image URL. Parameters passed into this function includes
   * `src` and an `options` object that contains the provided `width`, `height` and `loaderOptions` values.
   */
  loader?(props: ImageLoaderOptions): string;
  /** An object of `loader` function options. For example, if the `loader` function requires a `scale` option,
   * then the value can be a property of the `loaderOptions` object (for example, `{scale: 2}`).
   */
  loaderOptions?: ImageLoaderOptions['options'];
  /**
   * Whether the image will be immediately loaded. Defaults to `false`. This prop should be used only when
   * the image is visible above the fold. For more information, refer to the
   * [Image Embed element's loading attribute](https://developer.mozilla.org/enUS/docs/Web/HTML/Element/img#attr-loading).
   */
  priority?: boolean;
}

interface MediaImagePropsBase extends BaseImageProps {
  /** An object with fields that correspond to the Storefront API's
   * [Image object](https://shopify.dev/api/storefront/reference/common-objects/image).
   */
  data: PartialDeep<ImageType>;
  /** An object of image size options for Shopify CDN images. */
  options?: ImageSizeOptions;
}

interface ExternalImagePropsBase extends BaseImageProps {
  /** A URL string. This string can be an absolute path or a relative path depending on the `loader`. */
  src: string;
  /** The integer value for the width of the image. This is a required prop when `src` is present. */
  width: number;
  /** The integer value for the height of the image. This is a required prop when `src` is present. */
  height: number;
}

type BaseElementProps = React.ImgHTMLAttributes<HTMLImageElement>;
type MediaImageProps = Merge<BaseElementProps, MediaImagePropsBase>;
type ExternalImageProps = Merge<BaseElementProps, ExternalImagePropsBase>;
type ImageProps = MergeExclusive<MediaImageProps, ExternalImageProps>;

/**
 * The `Image` component renders an image for the Storefront API's
 * [Image object](https://shopify.dev/api/storefront/reference/common-objects/image).
 */
export function Image(props: ImageProps) {
  const {
    data,
    options,
    src,
    id,
    alt,
    width,
    height,
    loader,
    loaderOptions,
    priority,
    ...passthroughProps
  } = props;

  if (!data && !src) {
    throw new Error(
      'Image component: requires either an `data` or `src` prop.'
    );
  }

  if (!data && src && (!width || !height)) {
    throw new Error(
      `Image component: when 'src' is provided, 'width' and 'height' are required and needs to be valid values (i.e. greater than zero). Provided values: 'src': ${src}, 'width': ${width}, 'height': ${height}`
    );
  }

  const imgProps = data
    ? convertShopifyImageData({
        data,
        options,
        loader,
        loaderOptions,
        id,
        alt,
        priority,
      })
    : {
        src,
        id,
        alt,
        width,
        height,
        loader,
        priority,
        loaderOptions: {width, height, ...loaderOptions},
      };

  const srcPath = imgProps.loader
    ? imgProps.loader({src: imgProps.src, options: imgProps.loaderOptions})
    : imgProps.src;

  /* eslint-disable hydrogen/prefer-image-component */
  return (
    <>
      <img
        id={imgProps.id ?? ''}
        loading={imgProps.priority ? 'eager' : 'lazy'}
        alt={imgProps.alt ?? ''}
        {...passthroughProps}
        src={srcPath}
        width={imgProps.width ?? undefined}
        height={imgProps.height ?? undefined}
      />
      <Image2
        src=""
        width={11}
        height={11}
        loader={(src, width, height, opts) => {
          console.log(opts?.test);
          // console.log(opts?.hey);
          return '';
        }}
        loaderOptions={{test: 'hi'}}
      />
      <Image2
        data={{}}
        loader={(src, width, height, opts) => {
          console.log(opts.crop);
          return '';
        }}
        loaderOptions={{crop: 'left'}}
      />
    </>
  );
  /* eslint-enable hydrogen/prefer-image-component */
}

function convertShopifyImageData({
  data,
  options,
  loader,
  priority,
  loaderOptions,
  id: propId,
  alt,
}: MediaImageProps & {id?: string; alt?: string}) {
  const {url: src, altText, id} = data;
  if (!src) {
    throw new Error(`<Image/> requires 'data.url' when using the 'data' prop`);
  }
  const {width, height} = getShopifyImageDimensions(data, options);
  return {
    src,
    id: propId ? propId : id,
    alt: alt ? alt : altText,
    width,
    height,
    loader: loader ? loader : shopifyImageLoader,
    loaderOptions: {...options, ...loaderOptions},
    priority,
  };
}
