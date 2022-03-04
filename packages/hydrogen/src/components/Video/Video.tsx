import * as React from 'react';
import {Props} from '../types';
import {ImageSizeOptions, useImageUrl} from '../../utilities';
import {VideoFragment as Fragment} from '../../graphql/graphql-constants';

import {
  Video as VideoType,
  VideoSource,
  Image,
} from '../../graphql/types/types';

export interface VideoProps {
  /** An object corresponding to the [GraphQL fragment](#graphql-fragment). */
  data: {
    id?: VideoType['id'];
    previewImage?: Pick<Image, 'url'>;
    sources: Pick<VideoSource, 'url' | 'mimeType'>[];
  };
  /** An object of image size options for the video's `previewImage`. */
  options?: ImageSizeOptions;
}

/**
 * The `Video` component renders a `video` for the Storefront API's [`Video` object](/api/storefront/reference/products/video).
 */
export function Video<TTag extends React.ElementType = 'video'>(
  props: Props<TTag> & VideoProps
) {
  const {
    data,
    options,
    id = data.id,
    playsInline = true,
    controls = true,
    ...passthroughProps
  } = props;

  const posterUrl = useImageUrl(
    data.previewImage?.url as string | undefined,
    options
  );

  return (
    <video
      {...passthroughProps}
      id={id}
      playsInline={playsInline}
      controls={controls}
      poster={posterUrl}
    >
      {data.sources.map((source) => (
        <source
          key={source.url}
          src={source.url}
          type={source.mimeType}
        ></source>
      ))}
    </video>
  );
}

Video.Fragment = Fragment;
export const VideoFragment = Fragment;
