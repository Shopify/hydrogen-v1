import React from 'react';
import { Image } from '../Image';
import { Video } from '../Video';
import { ExternalVideo } from '../ExternalVideo';
import { ModelViewer } from '../ModelViewer';
/**
 * The `MediaFile` component renders the media for the Storefront API's
 * [Media object](https://shopify.dev/api/storefront/reference/products/media). It renders an `Image`, a
 * `Video`, an `ExternalVideo`, or a `ModelViewer` depending on the `mediaContentType` of the
 * `media` provided as a prop.
 */
export function MediaFile({ data, options, ...passthroughProps }) {
    switch (data.mediaContentType) {
        case 'IMAGE': {
            const dataImage = data
                .image;
            if (!dataImage || !dataImage.url) {
                console.warn(`No "image" property was found on the "data" prop for <MediaFile/>, for the "type='image'"`);
                return null;
            }
            return (React.createElement(Image, { ...passthroughProps, data: dataImage, loaderOptions: options }));
        }
        case 'VIDEO':
            return (React.createElement(Video, { ...passthroughProps, data: data, previewImageOptions: options }));
        case 'EXTERNAL_VIDEO':
            return (React.createElement(ExternalVideo, { ...passthroughProps, data: data, options: options }));
        case 'MODEL_3D':
            return (React.createElement(ModelViewer, { ...passthroughProps, data: data }));
        default:
            return null;
    }
}
