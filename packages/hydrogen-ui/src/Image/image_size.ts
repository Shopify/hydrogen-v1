import * as React from 'react';
import type {Image as ImageType} from '../storefront-api-types.js';
import type {PartialDeep} from 'type-fest';

export type Width = string | 'original';
export type Height = string | 'original';
export type Crop = 'top' | 'bottom' | 'left' | 'right' | 'center';
export type Scale = 2 | 3;
export type Format = 'jpg' | 'pjpg';

export interface ImageSizeOptions {
  width?: Width;
  height?: Height;
  crop?: Crop;
  scale?: Scale;
  format?: Format;
}

export interface ImageLoaderOptions {
  src: string;
  // this is fixed in the hydrogen repo
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options?: {[key: string]: any};
}

// TODO: Are there other CDNs missing from here?
const PRODUCTION_CDN_HOSTNAMES = [
  'cdn.shopify.com',
  'cdn.shopifycdn.net',
  'shopify-assets.shopifycdn.com',
  'shopify-assets.shopifycdn.net',
];

const LOCAL_CDN_HOSTNAMES = ['spin.dev'];

/**
 * Adds image size parameters to an image URL hosted by Shopify's CDN
 */
export function addImageSizeParametersToUrl(
  url: string,
  {width, height, crop, scale, format}: ImageSizeOptions
) {
  const newUrl = new URL(url);
  const sizePath = width || height ? `_${width ?? ''}x${height ?? ''}` : '';
  const cropPath = crop ? `_crop_${crop}` : '';
  const scalePath = scale ? `@${scale}x` : '';
  const progressive = format === 'pjpg' ? `.progressive` : '';
  const asJPG = format === 'jpg' ? `.jpg` : '';

  // We assume here that the last `.` is the delimiter
  // between the file name and the file type
  const fileDelimiterIndex = newUrl.pathname.lastIndexOf('.');
  const fileName = newUrl.pathname.substr(0, fileDelimiterIndex);
  const fileType = newUrl.pathname.substr(fileDelimiterIndex);
  newUrl.pathname = `${fileName}${sizePath}${cropPath}${scalePath}${progressive}${fileType}${asJPG}`;

  return newUrl.toString();
}

export function shopifyImageLoader({src, options}: ImageLoaderOptions) {
  const newSrc = new URL(src);
  const allowedCDNHostnames =
    PRODUCTION_CDN_HOSTNAMES.concat(LOCAL_CDN_HOSTNAMES);
  const isShopifyServedImage = allowedCDNHostnames.some((allowedHostname) =>
    newSrc.hostname.endsWith(allowedHostname)
  );

  if (
    !isShopifyServedImage ||
    options == null ||
    (!options.width &&
      !options.height &&
      !options.crop &&
      !options.scale &&
      !options.format)
  ) {
    return src;
  }

  return addImageSizeParametersToUrl(src, options);
}

export function useImageUrl(src?: string, options?: ImageSizeOptions) {
  return React.useMemo(() => {
    return src ? shopifyImageLoader({src, options}) : src;
  }, [options, src]);
}

export function getShopifyImageDimensions(
  image: Pick<
    PartialDeep<ImageType>,
    'altText' | 'url' | 'id' | 'width' | 'height'
  >,
  options?: ImageSizeOptions
) {
  // Storefront API could return null dimension values for images that are not hosted on Shopify CDN
  // The API dimensions references the image's intrinstic/natural dimensions and provides image aspect ratio information
  const apiWidth = image.width;
  const apiHeight = image.height;

  if (apiWidth && apiHeight && (options?.width || options?.height)) {
    const optionWidth = options?.width
      ? parseInt(options.width, 10)
      : undefined;
    const optionHeight = options?.height
      ? parseInt(options.height, 10)
      : undefined;

    // Use option defined width & height
    if (optionWidth && optionHeight) {
      return {width: optionWidth, height: optionHeight};
    }

    // Calculate width from aspect ratio
    if (!optionWidth && optionHeight) {
      return {
        width: Math.round((apiWidth / apiHeight) * optionHeight),
        height: optionHeight,
      };
    }

    // Calculate height from aspect ratio
    if (optionWidth && !optionHeight) {
      return {
        width: optionWidth,
        height: Math.round((apiHeight / apiWidth) * optionWidth),
      };
    }
  }

  return {width: apiWidth, height: apiHeight};
}
