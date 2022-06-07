import React from 'react';
import {shopifyImageLoader} from '../../utilities';
import type {Video as VideoType} from '../../storefront-api-types';
import type {PartialDeep} from 'type-fest';

interface VideoProps {
  /** An object with fields that correspond to the Storefront API's [Video object](https://shopify.dev/api/storefront/latest/objects/video). */
  data: PartialDeep<VideoType>;
  /** An object of image size options for the video's `previewImage`. Uses `shopifyImageLoader` to generate the `poster` URL. */
  previewImageOptions?: Parameters<typeof shopifyImageLoader>[0];
}

/**
 * The `Video` component renders a `video` for the Storefront API's [Video object](https://shopify.dev/api/storefront/reference/products/video).
 */
export function Video(props: JSX.IntrinsicElements['video'] & VideoProps) {
  const {
    data,
    previewImageOptions,
    id = data.id,
    playsInline = true,
    controls = true,
    ...passthroughProps
  } = props;

  const posterUrl = shopifyImageLoader({
    src: data.previewImage?.url ?? '',
    ...previewImageOptions,
  });

  if (!data.sources) {
    throw new Error(`<Video/> requires a 'data.sources' array`);
  }

  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <video
      {...passthroughProps}
      id={id}
      playsInline={playsInline}
      controls={controls}
      poster={posterUrl}
    >
      {data.sources.map((source) => {
        if (!(source?.url && source?.mimeType)) {
          throw new Error(`<Video/> needs 'source.url' and 'source.mimeType'`);
        }
        return (
          <source
            key={source.url}
            src={source.url}
            type={source.mimeType}
          ></source>
        );
      })}
    </video>
  );
}
