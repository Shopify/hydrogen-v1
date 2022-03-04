import * as React from 'react';
import {YouTube, Vimeo, useEmbeddedVideoUrl} from '../../utilities';
import {Props} from '../types';
import {ExternalVideoFragment as Fragment} from '../../graphql/graphql-constants';
import type {ExternalVideoFragmentFragment} from './ExternalVideoFragment';

export interface ExternalVideoProps {
  /** An object with the keys `host`, `embeddedUrl`, and `id`. Refer to the Storefront API's
   * [`ExternalVideo` type](/api/storefront/reference/products/externalvideo).
   */
  data: ExternalVideoFragmentFragment;
  /** An object containing the options available for either
   * [YouTube](https://developers.google.com/youtube/player_parameters#Parameters) or
   * [Vimeo](https://vimeo.zendesk.com/hc/en-us/articles/360001494447-Using-Player-Parameters).
   */
  options?: YouTube | Vimeo;
}

type PropsWeControl = 'src';

/**
 * The `ExternalVideo` component renders an embedded video for the Storefront
 * API's [`ExternalVideo` object](/api/storefront/reference/products/externalvideo).
 */
export function ExternalVideo<TTag extends React.ElementType = 'iframe'>(
  props: Props<TTag, PropsWeControl> & ExternalVideoProps
) {
  const {
    data,
    options,
    id = data.id,
    frameBorder = '0',
    allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture',
    allowFullScreen = true,
    ...passthroughProps
  } = props;

  const url = useEmbeddedVideoUrl(data.embeddedUrl, options);

  return (
    <iframe
      {...passthroughProps}
      id={id}
      frameBorder={frameBorder}
      allow={allow}
      allowFullScreen={allowFullScreen}
      src={url}
    ></iframe>
  );
}

ExternalVideo.Fragment = Fragment;

export const ExternalVideoFragment = Fragment;
