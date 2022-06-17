import type { Image as ImageType } from '../storefront-api-types';
import type { PartialDeep } from 'type-fest';
import type { ShopifyLoaderOptions, ShopifyLoaderParams } from '../components/Image';
/**
 * Adds image size parameters to an image URL hosted by Shopify's CDN
 */
export declare function addImageSizeParametersToUrl({ src, width, height, crop, scale, }: ShopifyLoaderParams): string;
export declare function shopifyImageLoader(params: ShopifyLoaderParams): string;
declare type HtmlImageProps = React.ImgHTMLAttributes<HTMLImageElement>;
export declare type GetShopifyImageDimensionsProps = {
    data: Pick<PartialDeep<ImageType>, 'altText' | 'url' | 'id' | 'width' | 'height'>;
    loaderOptions?: ShopifyLoaderOptions;
    elementProps?: {
        width?: HtmlImageProps['width'];
        height?: HtmlImageProps['height'];
    };
};
declare type GetShopifyImageDimensionsPropsReturn = {
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
export declare function getShopifyImageDimensions({ data: sfapiImage, loaderOptions, elementProps, }: GetShopifyImageDimensionsProps): GetShopifyImageDimensionsPropsReturn;
export {};
