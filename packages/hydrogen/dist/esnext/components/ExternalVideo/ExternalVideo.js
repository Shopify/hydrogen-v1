import React from 'react';
import { useEmbeddedVideoUrl } from '../../utilities';
/**
 * The `ExternalVideo` component renders an embedded video for the Storefront
 * API's [ExternalVideo object](https://shopify.dev/api/storefront/reference/products/externalvideo).
 */
export function ExternalVideo(props) {
    const { data, options, id = data.id, frameBorder = '0', allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture', allowFullScreen = true, ...passthroughProps } = props;
    if (!data.embedUrl) {
        throw new Error(`<ExternalVideo/> requires the 'embedUrl' property`);
    }
    const url = useEmbeddedVideoUrl(data.embedUrl, options);
    return (React.createElement("iframe", { ...passthroughProps, id: id ?? data.embedUrl, frameBorder: frameBorder, allow: allow, allowFullScreen: allowFullScreen, src: url }));
}
