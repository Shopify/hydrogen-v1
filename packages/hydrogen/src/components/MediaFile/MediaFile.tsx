import * as React from 'react';
import {
  Image,
  type MediaImageProps,
  type ImageComponentPassthroughProps,
} from '../Image';
import {
  Video,
  type VideoProps,
  type VideoComponentPassthroughProps,
} from '../Video';
import {
  ExternalVideo,
  type ExternalVideoProps,
  type ExternalVideoComponentPassthroughProps,
} from '../ExternalVideo';
import {
  ModelViewer,
  type ModelViewerProps,
  type ModelViewerComponentPassthroughProps,
} from '../ModelViewer';
import {MediaFileFragment as Fragment} from '../../graphql/graphql-constants';
import {Media as MediaType} from '../../graphql/types/types';

export type Media = Pick<MediaType, 'mediaContentType'>;
type MediaImageMedia = Media & {image: MediaImageProps['data']};
type ModelViewerMedia = Media & ModelViewerProps['data'];
type ExternalVideoMedia = Media & ExternalVideoProps['data'];
type VideoMedia = Media & VideoProps['data'];

export interface MediaFileProps {
  /** A [Media object](/api/storefront/reference/products/media). */
  data: MediaImageMedia | VideoMedia | ExternalVideoMedia | ModelViewerMedia;
  /** The options for the `Image`, `Video`, `ExternalVideo`, or `ModelViewer` components. */
  options?: {
    image?: MediaImageProps['options'];
    video?: VideoProps['options'];
    externalVideo?: ExternalVideoProps['options'] & {
      width?: HTMLIFrameElement['width'];
      height?: HTMLIFrameElement['height'];
    };
    modelViewer: never;
  };
  /** Props that are passed directly to the HTML element that is rendered by the components */
  passthroughProps?: {
    image?: ImageComponentPassthroughProps;
    video?: VideoComponentPassthroughProps;
    externalVideo?: ExternalVideoComponentPassthroughProps;
    modelViewer?: ModelViewerComponentPassthroughProps;
  };
}

/**
 * The `MediaFile` component renders the media for the Storefront API's
 * [Media object](/api/storefront/reference/products/media). It renders an `Image`, a
 * `Video`, an `ExternalVideo`, or a `ModelViewer` depending on the `mediaContentType` of the
 * `media` provided as a prop.
 */
export function MediaFile({
  data,
  options,
  passthroughProps,
  ...rest
}: MediaFileProps) {
  switch (data.mediaContentType) {
    case 'IMAGE': {
      return (
        <Image
          {...rest}
          {...passthroughProps?.image}
          data={(data as MediaImageMedia).image}
          options={options?.image}
        />
      );
    }
    case 'VIDEO':
      return (
        <Video
          {...rest}
          {...passthroughProps?.video}
          data={data as VideoMedia}
          options={options?.video}
        />
      );
    case 'EXTERNAL_VIDEO':
      return (
        <ExternalVideo
          {...rest}
          {...passthroughProps?.externalVideo}
          data={data as ExternalVideoMedia}
          options={options?.externalVideo}
        />
      );
    case 'MODEL_3D':
      return (
        <ModelViewer
          {...rest}
          {...passthroughProps?.modelViewer}
          data={data as ModelViewerMedia}
        />
      );
    default:
      return null;
  }
}

MediaFile.Fragment = Fragment;

export const MediaFileFragment = Fragment;
