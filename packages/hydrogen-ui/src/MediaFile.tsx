import React from 'react';
import {Image, type ShopifyImageProps} from './Image.js';
import {Video} from './Video.js';
import {ExternalVideo} from './ExternalVideo.js';
import {ModelViewer} from './ModelViewer.js';
import type {MediaEdge as MediaEdgeType} from './storefront-api-types.js';
import type {PartialDeep} from 'type-fest';

interface MediaFileProps {
  /** An object with fields that correspond to the Storefront API's [Media object](https://shopify.dev/api/storefront/reference/products/media). */
  data: PartialDeep<MediaEdgeType['node']>;
  /** The options for the `Image`, `Video`, or `ExternalVideo` components. */
  mediaOptions?: {
    /** Props that will only apply when an `<Image />` is rendered */
    image: Omit<ShopifyImageProps, 'data'>;
    /** Props that will only apply when a `<Video />` is rendered */
    video: Omit<React.ComponentProps<typeof Video>, 'data'>;
    /** Props that will only apply when an `<ExternalVideo />` is rendered */
    externalVideo: Omit<
      React.ComponentProps<typeof ExternalVideo>['options'],
      'data'
    >;
    /** Props that will only apply when a `<ModelViewer />` is rendered */
    modelViewer: Omit<typeof ModelViewer, 'data'>;
  };
}

/**
 * The `MediaFile` component renders the media for the Storefront API's
 * [Media object](https://shopify.dev/api/storefront/reference/products/media). It renders an `Image`, a
 * `Video`, an `ExternalVideo`, or a `ModelViewer` depending on the `__typename` of the `data` prop.
 */
export function MediaFile({
  data,
  mediaOptions,
  ...passthroughProps
}: MediaFileProps) {
  switch (data.__typename) {
    case 'MediaImage': {
      if (!data.image) {
        const noDataImage = `<MediaFile/>: 'data.image' does not exist for __typename of 'MediaImage'; rendering 'null' by default.`;
        if (__HYDROGEN_DEV__) {
          throw new Error(noDataImage);
        } else {
          console.warn(noDataImage);
          return null;
        }
      }

      return (
        <Image
          {...passthroughProps}
          {...mediaOptions?.image}
          data={data.image}
        />
      );
    }
    case 'Video': {
      return (
        <Video {...passthroughProps} {...mediaOptions?.video} data={data} />
      );
    }
    case 'ExternalVideo': {
      return (
        <ExternalVideo
          {...passthroughProps}
          {...mediaOptions?.externalVideo}
          data={data}
        />
      );
    }
    case 'Model3d': {
      return (
        <ModelViewer
          {...passthroughProps}
          {...mediaOptions?.modelViewer}
          data={data}
        />
      );
    }
    default: {
      const typenameMissingMessage = `<MediaFile /> requires the '__typename' property to exist on the 'data' prop in order to correctly render the correct component for this media. Rendering 'null' by default`;
      if (__HYDROGEN_DEV__) {
        throw new Error(typenameMissingMessage);
      } else {
        console.error(typenameMissingMessage);
        return null;
      }
    }
  }
}
