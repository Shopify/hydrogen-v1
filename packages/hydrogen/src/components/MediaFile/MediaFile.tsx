import * as React from 'react';
import {Image, MediaImageProps} from '../Image';
import {Video, VideoProps} from '../Video';
import {ExternalVideo, ExternalVideoProps} from '../ExternalVideo';
import {Model3D, Model3DProps} from '../Model3D';
import {MediaFileFragment as Fragment} from '../../graphql/graphql-constants';
import {Media as MediaType} from '../../graphql/types/types';

export type Media = Pick<MediaType, 'mediaContentType'>;

type MediaImageMedia = Media & MediaImageProps;
type Model3DMedia = Media & Model3DProps['model'];
type ExternalVideoMedia = Media & ExternalVideoProps['video'];
type VideoMedia = Media & VideoProps['video'];

export interface MediaFileProps {
  /** A [Media object](/api/storefront/reference/products/media). */
  media: MediaImageMedia | Model3DMedia | ExternalVideoMedia | VideoMedia;
  /** The options for the `Image`, `Video`, `ExternalVideo`, or `Model3D` components. */
  options?: VideoProps['options'] | ExternalVideoProps['options'];
}

/**
 * The `MediaFile` component renders the media for the Storefront API's
 * [Media object](/api/storefront/reference/products/media). It renders an `Image`, a
 * `Video`, an `ExternalVideo`, or a `Model3D` depending on the `mediaContentType` of the
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
          video={media as VideoMedia}
          options={options as VideoProps['options']}
        />
      );
    case 'EXTERNAL_VIDEO':
      return (
        <ExternalVideo
          {...passthroughProps}
          video={media as ExternalVideoMedia}
          options={options as ExternalVideoProps['options']}
        />
      );
    case 'MODEL_3D':
      return <Model3D {...passthroughProps} model={media as Model3DMedia} />;
    default:
      return null;
  }
}

MediaFile.Fragment = Fragment;

export const MediaFileFragment = Fragment;
