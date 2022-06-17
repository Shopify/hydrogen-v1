import React from 'react';
import { type ShopifyImageProps } from '../Image';
import { Video } from '../Video';
import { ExternalVideo } from '../ExternalVideo';
import type { MediaEdge as MediaEdgeType } from '../../storefront-api-types';
import type { PartialDeep } from 'type-fest';
export interface MediaFileProps {
    /** An object with fields that correspond to the Storefront API's [Media object](https://shopify.dev/api/storefront/reference/products/media). */
    data: PartialDeep<MediaEdgeType['node']>;
    /** The options for the `Image`, `Video`, or `ExternalVideo` components. */
    options?: ShopifyImageProps | React.ComponentProps<typeof Video>['previewImageOptions'] | React.ComponentProps<typeof ExternalVideo>['options'];
}
/**
 * The `MediaFile` component renders the media for the Storefront API's
 * [Media object](https://shopify.dev/api/storefront/reference/products/media). It renders an `Image`, a
 * `Video`, an `ExternalVideo`, or a `ModelViewer` depending on the `mediaContentType` of the
 * `media` provided as a prop.
 */
export declare function MediaFile({ data, options, ...passthroughProps }: MediaFileProps): JSX.Element | null;
