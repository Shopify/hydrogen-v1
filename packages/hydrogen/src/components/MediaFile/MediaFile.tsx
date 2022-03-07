import React from 'react';
import {Image} from '../Image';
import {Video} from '../Video';
import {ExternalVideo} from '../ExternalVideo';
import {ModelViewer} from '../ModelViewer';
import {MediaFileFragment as Fragment} from '../../graphql/graphql-constants';
// import {Media as MediaType} from '../../graphql/types/types';
import type {
  MediaFileFragmentFragment,
  MediaFileFragment_ExternalVideo_Fragment,
  MediaFileFragment_MediaImage_Fragment,
  MediaFileFragment_Model3d_Fragment,
  MediaFileFragment_Video_Fragment,
} from './MediaFileFragment';

export interface MediaFileProps {
  /** A [Media object](/api/storefront/reference/products/media). */
  data: MediaFileFragmentFragment;
  /** The options for the `Image`, `Video`, `ExternalVideo`, or `ModelViewer` components. */
  options?:
    | React.ComponentProps<typeof Video>['options']
    | React.ComponentProps<typeof ExternalVideo>['options'];
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
  ...passthroughProps
}: MediaFileProps) {
  switch (data.mediaContentType) {
    case 'IMAGE': {
      const dataImage = (data as MediaFileFragment_MediaImage_Fragment).image;
      if (!dataImage) {
        console.warn(
          `No "image" property was found on the "data" prop for <MediaFile/>, for the "type='image'"`
        );
        return null;
      }
      return (
        <Image
          {...passthroughProps}
          data={dataImage}
          options={options as React.ComponentProps<typeof Image>['options']}
        />
      );
    }
    case 'VIDEO':
      return (
        <Video
          {...passthroughProps}
          data={data as MediaFileFragment_Video_Fragment}
          options={options as React.ComponentProps<typeof Video>['options']}
        />
      );
    case 'EXTERNAL_VIDEO':
      return (
        <ExternalVideo
          {...passthroughProps}
          data={data as MediaFileFragment_ExternalVideo_Fragment}
          options={
            options as React.ComponentProps<typeof ExternalVideo>['options']
          }
        />
      );
    case 'MODEL_3D':
      return (
        <ModelViewer
          {...passthroughProps}
          data={data as MediaFileFragment_Model3d_Fragment}
        />
      );
    default:
      return null;
  }
}

MediaFile.Fragment = Fragment;

export const MediaFileFragment = Fragment;
