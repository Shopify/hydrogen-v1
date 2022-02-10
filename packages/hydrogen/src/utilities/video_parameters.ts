import {useMemo} from 'react';

export interface YouTube {
  autoplay?: 0 | 1;
  cc_lang_pref?: string;
  cc_load_policy?: 1;
  color?: 'red' | 'white';
  controls?: 0 | 1;
  disablekb?: 0 | 1;
  enablejsapi?: 0 | 1;
  end?: number;
  fs?: 0 | 1;
  hl?: string;
  iv_load_policy?: 1 | 3;
  list?: string;
  list_type?: 'playlist' | 'user_uploads';
  loop?: 0 | 1;
  modest_branding?: 1;
  origin?: string;
  playlist?: string;
  plays_inline?: 0 | 1;
  rel?: 0 | 1;
  start?: number;
  widget_referrer?: string;
}

type VimeoBoolean = 0 | 1 | boolean;

export interface Vimeo {
  autopause?: VimeoBoolean;
  autoplay?: VimeoBoolean;
  background?: VimeoBoolean;
  byline?: VimeoBoolean;
  color?: string;
  controls?: VimeoBoolean;
  dnt?: VimeoBoolean;
  loop?: VimeoBoolean;
  muted?: VimeoBoolean;
  pip?: VimeoBoolean;
  playsinline?: VimeoBoolean;
  portrait?: VimeoBoolean;
  quality?: '240p' | '360p' | '540p' | '720p' | '1080p' | '2k' | '4k';
  speed?: VimeoBoolean;
  '#t'?: string;
  texttrack?: string;
  title?: VimeoBoolean;
  transparent?: VimeoBoolean;
}

export function addParametersToEmbeddedVideoUrl(
  url: string,
  parameters?: YouTube | Vimeo
) {
  if (parameters == null) {
    return url;
  }

  const params = Object.keys(parameters).reduce((accumulator, param) => {
    const value = (parameters as any)[param];
    if (value == null) {
      return accumulator;
    }

    return accumulator + `&${param}=${value}`;
  }, '');

  return `${url}?${params}`;
}

export function useEmbeddedVideoUrl(url: string, parameters?: YouTube | Vimeo) {
  // Ensure a youtube shortened url is changed to an iFrame compatible embed link.
  // TODO: Fix is needed for SFAPI version 2022-01. Starting 2022-04 embeddedUrl has been marked as deprecated and replaced with
  // embedUrl. When the pinned SFAPI version is 2022-04 line can be removed in favor of changes on PR #455
  url = url.replace(/youtu.be/, 'www.youtube.com/embed');
  return useMemo(() => {
    if (!parameters) {
      return url;
    }

    return addParametersToEmbeddedVideoUrl(url, parameters);
  }, [url, parameters]);
}
