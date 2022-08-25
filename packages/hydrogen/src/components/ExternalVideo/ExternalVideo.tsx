import React from 'react';
import {YouTube, Vimeo, useEmbeddedVideoUrl} from '../../utilities/index.js';
import type {ExternalVideo as ExternalVideoType} from '../../storefront-api-types.js';
import type {PartialDeep} from 'type-fest';

interface ExternalVideoProps {
  /**
   * An object with fields that correspond to the Storefront API's [ExternalVideo object](https://shopify.dev/api/storefront/reference/products/externalvideo).
   */
  data: PartialDeep<ExternalVideoType>;
  /** An object containing the options available for either
   * [YouTube](https://developers.google.com/youtube/player_parameters#Parameters) or
   * [Vimeo](https://vimeo.zendesk.com/hc/en-us/articles/360001494447-Using-Player-Parameters).
   */
  options?: YouTube | Vimeo;
}

type PropsWeControl = 'src';

/**
 * The `ExternalVideo` component renders an embedded video for the Storefront
 * API's [ExternalVideo object](https://shopify.dev/api/storefront/reference/products/externalvideo).
 */
export function ExternalVideo(
  props: Omit<JSX.IntrinsicElements['iframe'], PropsWeControl> &
    ExternalVideoProps
) {
  const {
    data,
    options,
    id = data.id,
    frameBorder = '0',
    allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture',
    allowFullScreen = true,
    loading = 'lazy',
    ...passthroughProps
  } = props;

  if (!data.embedUrl) {
    throw new Error(`<ExternalVideo/> requires the 'embedUrl' property`);
  }

  const url = useEmbeddedVideoUrl(data.embedUrl, options);

  return (
    <iframe
      {...passthroughProps}
      id={id ?? data.embedUrl}
      frameBorder={frameBorder}
      allow={allow}
      allowFullScreen={allowFullScreen}
      src={url}
      loading={loading}
    ></iframe>
  );
}
