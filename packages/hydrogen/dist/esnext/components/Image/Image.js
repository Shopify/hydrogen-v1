import * as React from 'react';
import { getShopifyImageDimensions, shopifyImageLoader, addImageSizeParametersToUrl, } from '../../utilities';
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
export function Image(props) {
    if (!props.data && !props.src) {
        throw new Error(`<Image/>: requires either a 'data' or 'src' prop.`);
    }
    if (__HYDROGEN_DEV__ && props.data && props.src) {
        console.warn(`<Image/>: using both 'data' and 'src' props is not supported; using the 'data' prop by default`);
    }
    if (props.data) {
        return React.createElement(ShopifyImage, { ...props });
    }
    else {
        return React.createElement(ExternalImage, { ...props });
    }
}
function ShopifyImage({ data, width, height, loading, loader = shopifyImageLoader, loaderOptions, widths, ...rest }) {
    if (!data.url) {
        throw new Error(`<Image/>: the 'data' prop requires the 'url' property`);
    }
    if (__HYDROGEN_DEV__ && !data.altText && !rest.alt) {
        console.warn(`<Image/>: the 'data' prop should have the 'altText' property, or the 'alt' prop, and one of them should not be empty. ${`Image: ${data.id ?? data.url}`}`);
    }
    const { width: finalWidth, height: finalHeight } = getShopifyImageDimensions({
        data,
        loaderOptions,
        elementProps: {
            width,
            height,
        },
    });
    if (__HYDROGEN_DEV__ && (!finalWidth || !finalHeight)) {
        console.warn(`<Image/>: the 'data' prop requires either 'width' or 'data.width', and 'height' or 'data.height' properties. ${`Image: ${data.id ?? data.url}`}`);
    }
    let finalSrc = data.url;
    if (loader) {
        finalSrc = loader({
            ...loaderOptions,
            src: data.url,
            width: finalWidth,
            height: finalHeight,
        });
        if (typeof finalSrc !== 'string' || !finalSrc) {
            throw new Error(`<Image/>: 'loader' did not return a valid string. ${`Image: ${data.id ?? data.url}`}`);
        }
    }
    // determining what the intended width of the image is. For example, if the width is specified and lower than the image width, then that is the maximum image width
    // to prevent generating a srcset with widths bigger than needed or to generate images that would distort because of being larger than original
    const maxWidth = width && finalWidth && width < finalWidth ? width : finalWidth;
    const finalSrcset = rest.srcSet ??
        internalImageSrcSet({
            ...loaderOptions,
            widths,
            src: data.url,
            width: maxWidth,
            loader,
        });
    /* eslint-disable hydrogen/prefer-image-component */
    return (React.createElement("img", { id: data.id ?? '', alt: data.altText ?? rest.alt ?? '', loading: loading ?? 'lazy', ...rest, src: finalSrc, width: finalWidth ?? undefined, height: finalHeight ?? undefined, srcSet: finalSrcset }));
    /* eslint-enable hydrogen/prefer-image-component */
}
function ExternalImage({ src, width, height, alt, loader, loaderOptions, widths, loading, ...rest }) {
    if (!width || !height) {
        throw new Error(`<Image/>: when 'src' is provided, 'width' and 'height' are required and need to be valid values (i.e. greater than zero). Provided values: 'src': ${src}, 'width': ${width}, 'height': ${height}`);
    }
    if (__HYDROGEN_DEV__ && !alt) {
        console.warn(`<Image/>: when 'src' is provided, 'alt' should also be provided. ${`Image: ${src}`}`);
    }
    if (widths &&
        Array.isArray(widths) &&
        widths.some((size) => isNaN(size)))
        throw new Error(`<Image/>: the 'widths' property must be an array of numbers`);
    let finalSrc = src;
    if (loader) {
        finalSrc = loader({ src, width, height, ...loaderOptions });
        if (typeof finalSrc !== 'string' || !finalSrc) {
            throw new Error(`<Image/>: 'loader' did not return a valid string`);
        }
    }
    let finalSrcset = rest.srcSet ?? undefined;
    if (!finalSrcset && loader && widths) {
        // Height is a requirement in the LoaderProps, so  to keep the aspect ratio, we must determine the height based on the default values
        const heightToWidthRatio = parseInt(height.toString()) / parseInt(width.toString());
        finalSrcset = widths
            ?.map((width) => parseInt(width, 10))
            ?.map((width) => `${loader({
            ...loaderOptions,
            src,
            width,
            height: Math.floor(width * heightToWidthRatio),
        })} ${width}w`)
            .join(', ');
    }
    /* eslint-disable hydrogen/prefer-image-component */
    return (React.createElement("img", { ...rest, src: finalSrc, 
        // @ts-expect-error TS doesn't understand that it could exist
        width: loaderOptions?.width ?? width, 
        // @ts-expect-error TS doesn't understand that it could exist
        height: loaderOptions?.height ?? height, alt: alt ?? '', loading: loading ?? 'lazy', srcSet: finalSrcset }));
    /* eslint-enable hydrogen/prefer-image-component */
}
// based on the default width sizes used by the Shopify liquid HTML tag img_tag plus a 2560 width to account for 2k resolutions
// reference: https://shopify.dev/api/liquid/filters/html-filters#image_tag
const IMG_SRC_SET_SIZES = [352, 832, 1200, 1920, 2560];
function internalImageSrcSet({ src, width, crop, scale, widths, loader, }) {
    const hasCustomWidths = widths && Array.isArray(widths);
    if (hasCustomWidths && widths.some((size) => isNaN(size)))
        throw new Error(`<Image/>: the 'widths' must be an array of numbers`);
    let setSizes = hasCustomWidths ? widths : IMG_SRC_SET_SIZES;
    if (!hasCustomWidths &&
        width &&
        width < IMG_SRC_SET_SIZES[IMG_SRC_SET_SIZES.length - 1])
        setSizes = IMG_SRC_SET_SIZES.filter((size) => size <= width);
    const srcGenerator = loader ? loader : addImageSizeParametersToUrl;
    return setSizes
        .map((size) => `${srcGenerator({
        src,
        width: size,
        crop,
        scale,
    })} ${size}w`)
        .join(', ');
}
