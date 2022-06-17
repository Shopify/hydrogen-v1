import * as React from 'react';
import type { Image as ImageType } from '../../storefront-api-types';
import type { PartialDeep, Simplify, SetRequired } from 'type-fest';
declare type HtmlImageProps = React.ImgHTMLAttributes<HTMLImageElement>;
declare type ImageProps<GenericLoaderOpts> = ShopifyImageProps | ExternalImageProps<GenericLoaderOpts>;
/**
 * The `Image` component renders an image for the Storefront API's
 * [Image object](https://shopify.dev/api/storefront/reference/common-objects/image) by using the `data` prop, or a custom location by using the `src` prop. You can [customize this component](https://shopify.dev/api/hydrogen/components#customizing-hydrogen-components) using passthrough props.
 *
 * An image's width and height are determined using the following priority list:
 * 1. The width and height values for the `loaderOptions` prop
 * 2. The width and height values for bare props
 * 3. The width and height values for the `data` prop
 *
 * If only one of `width` or `height` are defined, then the other will attempt to be calculated based on the image's aspect ratio,
 * provided that both `data.width` and `data.height` are available. If `data.width` and `data.height` aren't available, then the aspect ratio cannot be determined and the missing
 * value will remain as `null`
 */
export declare function Image<GenericLoaderOpts>(props: ImageProps<GenericLoaderOpts>): JSX.Element;
export declare type ShopifyLoaderOptions = {
    crop?: 'top' | 'bottom' | 'left' | 'right' | 'center';
    scale?: 2 | 3;
    width?: HtmlImageProps['width'] | ImageType['width'];
    height?: HtmlImageProps['height'] | ImageType['height'];
};
export declare type ShopifyLoaderParams = Simplify<ShopifyLoaderOptions & {
    src: ImageType['url'];
}>;
export declare type ShopifyImageProps = Omit<HtmlImageProps, 'src'> & {
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
    /**
     * An array of pixel widths to overwrite the default generated srcset. For example, `[300, 600, 800]`.
     */
    widths?: (HtmlImageProps['width'] | ImageType['width'])[];
};
declare type LoaderProps<GenericLoaderOpts> = {
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
declare type ExternalImageProps<GenericLoaderOpts> = SetRequired<HtmlImageProps, 'src' | 'width' | 'height' | 'alt'> & {
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
    /**
     * An array of pixel widths to generate a srcset. For example, `[300, 600, 800]`.
     */
    widths?: HtmlImageProps['width'][];
};
export {};
