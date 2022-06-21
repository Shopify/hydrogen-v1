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
  if (scale) {
    // Have to do this specifically for 'scale' because it doesn't currently work otherwise.
    // I'm also intentionally leaving 'scale' as a searchParam because that way it'll "just work" in the future and we can just delete this whole section of code

    // We assume here that the last `.` is the delimiter between the file name and the file type
    const baseUrl = new URL(src);
    const fileDelimiterIndex = baseUrl.pathname.lastIndexOf('.');
    const fileName = baseUrl.pathname.slice(0, fileDelimiterIndex);
    const fileType = baseUrl.pathname.slice(fileDelimiterIndex);
    baseUrl.pathname = `${fileName}${`@${scale.toString()}x`}${fileType}`;
    src = baseUrl.toString();
  }

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
        (aspectRatio
          ? // @ts-expect-error if width isn't defined, then height has to be defined due to the If statement above
            Math.round(aspectRatio * loaderOptions.height)
          : null),
      height:
        loaderOptions?.height ??
        (aspectRatio
          ? // @ts-expect-error if height isn't defined, then width has to be defined due to the If statement above
            Math.round(aspectRatio * loaderOptions.width)
          : null),
    };
  }

  //  * 2. `elementProps`'s width/height
  if (elementProps?.width || elementProps?.height) {
    return {
      width:
        elementProps?.width ??
        (aspectRatio
          ? // @ts-expect-error if width isn't defined, then height has to be defined due to the If statement above
            Math.round(aspectRatio * elementProps.height)
          : null),
      height:
        elementProps?.height ??
        (aspectRatio
          ? // @ts-expect-error if height isn't defined, then width has to be defined due to the If statement above
            Math.round(aspectRatio * elementProps.width)
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
