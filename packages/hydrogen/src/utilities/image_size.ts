import type {Image as ImageType} from '../storefront-api-types.js';
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

// based on the default width sizes used by the Shopify liquid HTML tag img_tag plus a 2560 width to account for 2k resolutions
// reference: https://shopify.dev/api/liquid/filters/html-filters#image_tag
export const IMG_SRC_SET_SIZES = [352, 832, 1200, 1920, 2560];

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

  const multipliedScale = scale ?? 1;

  if (width) {
    let finalWidth: string;

    if (typeof width === 'string') {
      finalWidth = (IMG_SRC_SET_SIZES[0] * multipliedScale).toString();
    } else {
      finalWidth = (Number(width) * multipliedScale).toString();
    }

    newUrl.searchParams.append('width', finalWidth);
  }

  if (height && typeof height === 'number') {
    newUrl.searchParams.append('height', (height * multipliedScale).toString());
  }

  crop && newUrl.searchParams.append('crop', crop);

  // for now we intentionally leave off the scale param, and instead multiple width & height by scale instead
  // scale && newUrl.searchParams.append('scale', scale.toString());

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

type HtmlImageProps = React.ImgHTMLAttributes<HTMLImageElement>;

export type GetShopifyImageDimensionsProps = {
  data: Pick<
    PartialDeep<ImageType>,
    'altText' | 'url' | 'id' | 'width' | 'height'
  >;
  loaderOptions?: ShopifyLoaderOptions;
  elementProps?: {
    width?: HtmlImageProps['width'];
    height?: HtmlImageProps['height'];
  };
};

type GetShopifyImageDimensionsPropsReturn = {
  width: number | string | null;
  height: number | string | null;
};

/**
 * Width and height are determined using the followiing priority list:
 * 1. `loaderOptions`'s width/height
 * 2. `elementProps`'s width/height
 * 3. `data`'s width/height
 *
 * If only one of `width` or `height` are defined, then the other will attempt to be calculated based on the Image's aspect ratio,
 * provided that both `data.width` and `data.height` are available. If not, then the aspect ratio cannot be determined and the missing
 * value will reamin as `null`
 */
export function getShopifyImageDimensions({
  data: sfapiImage,
  loaderOptions,
  elementProps,
}: GetShopifyImageDimensionsProps): GetShopifyImageDimensionsPropsReturn {
  let aspectRatio: number | null = null;

  if (sfapiImage?.width && sfapiImage?.height) {
    aspectRatio = sfapiImage?.width / sfapiImage?.height;
  }

  //  * 1. `loaderOptions`'s width/height
  if (loaderOptions?.width || loaderOptions?.height) {
    return {
      width:
        loaderOptions?.width ??
        (aspectRatio && typeof loaderOptions.height === 'number'
          ? Math.round(aspectRatio * loaderOptions.height)
          : null),
      height:
        loaderOptions?.height ??
        (aspectRatio && typeof loaderOptions.width === 'number'
          ? Math.round(aspectRatio * loaderOptions.width)
          : null),
    };
  }

  //  * 2. `elementProps`'s width/height
  if (elementProps?.width || elementProps?.height) {
    return {
      width:
        elementProps?.width ??
        (aspectRatio && typeof elementProps.height === 'number'
          ? Math.round(aspectRatio * elementProps.height)
          : null),
      height:
        elementProps?.height ??
        (aspectRatio && typeof elementProps.width === 'number'
          ? Math.round(aspectRatio * elementProps.width)
          : null),
    };
  }

  //  * 3. `data`'s width/height
  if (sfapiImage?.width || sfapiImage?.height) {
    return {
      // can't calculate the aspect ratio here
      width: sfapiImage?.width ?? null,
      height: sfapiImage?.height ?? null,
    };
  }

  return {width: null, height: null};
}
