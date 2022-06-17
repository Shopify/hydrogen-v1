import React from 'react';
import { shopifyImageLoader } from '../../utilities';
/**
 * The `Video` component renders a `video` for the Storefront API's [Video object](https://shopify.dev/api/storefront/reference/products/video).
 */
export function Video(props) {
    const { data, previewImageOptions, id = data.id, playsInline = true, controls = true, ...passthroughProps } = props;
    const posterUrl = shopifyImageLoader({
        src: data.previewImage?.url ?? '',
        ...previewImageOptions,
    });
    if (!data.sources) {
        throw new Error(`<Video/> requires a 'data.sources' array`);
    }
    return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    React.createElement("video", { ...passthroughProps, id: id, playsInline: playsInline, controls: controls, poster: posterUrl }, data.sources.map((source) => {
        if (!(source?.url && source?.mimeType)) {
            throw new Error(`<Video/> needs 'source.url' and 'source.mimeType'`);
        }
        return (React.createElement("source", { key: source.url, src: source.url, type: source.mimeType }));
    })));
}
