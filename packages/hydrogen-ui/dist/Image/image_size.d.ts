import type { Image as ImageType } from '../storefront-api-types';
import type { PartialDeep } from 'type-fest';
export declare type Width = string | 'original';
export declare type Height = string | 'original';
export declare type Crop = 'top' | 'bottom' | 'left' | 'right' | 'center';
export declare type Scale = 2 | 3;
export declare type Format = 'jpg' | 'pjpg';
export interface ImageSizeOptions {
    width?: Width;
    height?: Height;
    crop?: Crop;
    scale?: Scale;
    format?: Format;
}
export interface ImageLoaderOptions {
    src: string;
    options?: {
        [key: string]: any;
    };
}
/**
 * Adds image size parameters to an image URL hosted by Shopify's CDN
 */
export declare function addImageSizeParametersToUrl(url: string, { width, height, crop, scale, format }: ImageSizeOptions): string;
export declare function shopifyImageLoader({ src, options }: ImageLoaderOptions): string;
export declare function useImageUrl(src?: string, options?: ImageSizeOptions): string | undefined;
export declare function getShopifyImageDimensions(image: Pick<PartialDeep<ImageType>, 'altText' | 'url' | 'id' | 'width' | 'height'>, options?: ImageSizeOptions): {
    width: import("../storefront-api-types").Maybe<number> | undefined;
    height: import("../storefront-api-types").Maybe<number> | undefined;
};
