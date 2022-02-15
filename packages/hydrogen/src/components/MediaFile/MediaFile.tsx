import * as React from 'react';
import {Image, MediaImageProps} from '../Image';
import {Video, VideoProps} from '../Video';
import {ExternalVideo, ExternalVideoProps} from '../ExternalVideo';
import {ModelViewer, ModelViewerProps} from '../ModelViewer';
import {MediaFileFragment as Fragment} from '../../graphql/graphql-constants';
import {Media as MediaType} from '../../graphql/types/types';

export type Media = Pick<MediaType, 'mediaContentType'>;

type MediaImageMedia = Media & MediaImageProps;
type ModelViewerMedia = Media & ModelViewerProps['data'];
type ExternalVideoMedia = Media & ExternalVideoProps['data'];
type VideoMedia = Media & VideoProps['data'];

export interface MediaFileProps {
  /** A [Media object](/api/storefront/reference/products/media). */
  media: MediaImageMedia | ModelViewerMedia | ExternalVideoMedia | VideoMedia;
  /** The options for the `Image`, `Video`, `ExternalVideo`, or `ModelViewer` components. */
  options?: VideoProps['options'] | ExternalVideoProps['options'];
}

/**
 * The `MediaFile` component renders the media for the Storefront API's
 * [Media object](/api/storefront/reference/products/media). It renders an `Image`, a
 * `Video`, an `ExternalVideo`, or a `ModelViewer` depending on the `mediaContentType` of the
 * `media` provided as a prop.
 */
export function MediaFile({
  media,
  options,
  ...passthroughProps
}: MediaFileProps) {
  switch (media.mediaContentType) {
    case 'IMAGE': {
      return (
        <Image
          {...passthroughProps}
          image={(media as MediaImageMedia).image}
          options={options as MediaImageProps['options']}
        />
      );
    }
    case 'VIDEO':
      return (
        <Video
          {...passthroughProps}
          data={media as VideoMedia}
          options={options as VideoProps['options']}
        />
      );
    case 'EXTERNAL_VIDEO':
      return (
        <ExternalVideo
          {...passthroughProps}
          data={media as ExternalVideoMedia}
          options={options as ExternalVideoProps['options']}
        />
      );
    case 'MODEL_3D':
      return (
        <ModelViewer {...passthroughProps} data={media as ModelViewerMedia} />
      );
    default:
      return null;
  }
}

MediaFile.Fragment = Fragment;

export const MediaFileFragment = Fragment;
