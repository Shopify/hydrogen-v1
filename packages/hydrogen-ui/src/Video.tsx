import {ImageSizeOptions, useImageUrl} from './image_size.js';
import type {Video as VideoType} from './storefront-api-types.js';
import type {PartialDeep} from 'type-fest';

interface VideoProps {
  /** An object with fields that correspond to the Storefront API's [Video object](https://shopify.dev/api/storefront/latest/objects/video). */
  data: PartialDeep<VideoType>;
  /** An object of image size options for the video's `previewImage`. */
  options?: ImageSizeOptions;
}

/**
 * The `Video` component renders a `video` for the Storefront API's [Video object](https://shopify.dev/api/storefront/reference/products/video).
 */
export function Video(props: JSX.IntrinsicElements['video'] & VideoProps) {
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

  if (__HYDROGEN_DEV__) {
    console.warn('hello dev warning');
  }

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
      data-testid="video"
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
            data-testid="video-screen"
          ></source>
        );
      })}
    </video>
  );
}
