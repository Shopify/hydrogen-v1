import type {Image as ImageType} from '../storefront-api-types';
import type {PartialDeep} from 'type-fest';
import type {
  ShopifyLoaderOptions,
  ShopifyLoaderParams,
} from '../components/Image';

// TODO: Are there other CDNs missing from here?
const PRODUCTION_CDN_HOSTNAMES = [
  'cdn.shopify.com',
  'cdn.shopifycdn.net',
  'shopify-assets.shopifycdn.com',
  'shopify-assets.shopifycdn.net',
];
const LOCAL_CDN_HOSTNAMES = ['spin.dev'];
const ALL_CDN_HOSTNAMES = [...PRODUCTION_CDN_HOSTNAMES, ...LOCAL_CDN_HOSTNAMES];

/**
 * Adds image size parameters to an image URL hosted by Shopify's CDN
 */
export function addImageSizeParametersToUrl({
  src,
  width,
  height,
  crop,
  scale,
}: ShopifyLoaderParams) {
  const newUrl = new URL(src);
  width && newUrl.searchParams.append('width', width.toString());
  height && newUrl.searchParams.append('height', height.toString());
  crop && newUrl.searchParams.append('crop', crop);
  scale && newUrl.searchParams.append('scale', scale.toString());

  return newUrl.toString();
}

export function shopifyImageLoader(params: ShopifyLoaderParams) {
  const newSrc = new URL(params.src);
  const isShopifyServedImage = ALL_CDN_HOSTNAMES.some((allowedHostname) =>
    newSrc.hostname.endsWith(allowedHostname)
  );

  if (
    !isShopifyServedImage ||
    (!params.width && !params.height && !params.crop && !params.scale)
  ) {
    return params.src;
  }

  return addImageSizeParametersToUrl(params);
}

export function getShopifyImageDimensions(
  image: Pick<
    PartialDeep<ImageType>,
    'altText' | 'url' | 'id' | 'width' | 'height'
  >,
  options?: ShopifyLoaderOptions,
  inputWidth?: string | number,
  inputHeight?: string | number
) {
  // Storefront API could return null dimension values for images that are not hosted on Shopify CDN
  // The API dimensions references the image's intrinstic/natural dimensions and provides image aspect ratio information
  const apiWidth = image.width;
  const apiHeight = image.height;

  if (apiWidth && apiHeight && (options?.width || options?.height)) {
    const optionWidth = options?.width
      ? parseInt(options.width.toString(), 10)
      : undefined;
    const optionHeight = options?.height
      ? parseInt(options.height.toString(), 10)
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
  if (apiWidth && apiHeight && (inputWidth || inputHeight)) {
    const inputtedWidth =
      typeof inputWidth === 'number' ? inputWidth : undefined;
    const inputtedHeight =
      typeof inputHeight === 'number' ? inputHeight : undefined;

    // Use input width & height
    if (inputtedWidth && inputtedHeight) {
      return {width: inputtedWidth, height: inputtedHeight};
    }

    // Calculate inputted width from aspect ratio
    if (!inputtedWidth && inputtedHeight) {
      return {
        width: Math.round((apiWidth / apiHeight) * inputtedHeight),
        height: inputtedHeight,
      };
    }

    // Calculate inputted height from aspect ratio
    if (inputtedWidth && !inputtedHeight) {
      return {
        width: inputtedWidth,
        height: Math.round((apiHeight / apiWidth) * inputtedWidth),
      };
    }
  }

  return {width: apiWidth, height: apiHeight};
}
