import React from 'react';
import {Props} from '../types';
import {
  ImageSizeOptions,
  ImageLoaderOptions,
  shopifyImageLoader,
  getShopifyImageDimensions,
} from '../../utilities';
import type {ImageFragmentFragment} from './ImageFragment';

export interface BaseImageProps {
  /** A custom function that generates the image URL. Parameters passed into this function includes
   * `src` and an `options` object that contains the provided `width`, `height` and `loaderOptions` values.
   */
  loader?(props: ImageLoaderOptions): string;
  /** An object of `loader` function options. For example, if the `loader` function requires a `scale` option,
   * then the value can be a property of the `loaderOptions` object (for example, `{scale: 2}`).
   */
  loaderOptions?: ImageLoaderOptions['options'];
}

interface MediaImageProps extends BaseImageProps {
  /** An object with keys that correspond to the Storefront API's
   * [Image object](/api/storefront/reference/common-objects/image).
   */
  data: ImageFragmentFragment;
  /** An object of image size options for Shopify CDN images. */
  options?: ImageSizeOptions;
}

interface ExternalImageProps extends BaseImageProps {
  /** A URL string. This string can be an absolute path or a relative path depending on the `loader`. */
  src: string;
  /** The integer value for the width of the image. This is a required prop when `src` is present. */
  width: number;
  /** The integer value for the height of the image. This is a required prop when `src` is present. */
  height: number;
}

type ImageProps = MediaImageProps | ExternalImageProps;

type PropsWeControl = 'src' | 'width' | 'height';

function convertShopifyImageData({
  data,
  options,
  loader,
  loaderOptions,
  id: propId,
  alt,
}: MediaImageProps & {id?: string; alt?: string}) {
  const {url: src, altText, id} = data;
  const {width, height} = getShopifyImageDimensions(data, options);
  return {
    src,
    id: propId ? propId : id,
    alt: alt ? alt : altText,
    width,
    height,
    loader: loader ? loader : shopifyImageLoader,
    loaderOptions: {...options, ...loaderOptions},
  };
}

/**
 * The `Image` component renders an image for the Storefront API's
 * [Image object](/api/storefront/reference/common-objects/image).
 */
export function Image<TTag extends React.ElementType = 'img'>(
  props: Props<TTag, PropsWeControl> & ImageProps
) {
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
      })
    : {
        src,
        id,
        alt,
        width,
        height,
        loader,
        loaderOptions: {width, height, ...loaderOptions},
      };

  const srcPath = imgProps.loader
    ? imgProps.loader({src: imgProps.src, options: imgProps.loaderOptions})
    : imgProps.src;

  return (
    <img
      id={imgProps.id ?? ''}
      loading="lazy"
      alt={imgProps.alt ?? ''}
      {...passthroughProps}
      src={srcPath}
      width={imgProps.width ?? undefined}
      height={imgProps.height ?? undefined}
    />
  );
}
