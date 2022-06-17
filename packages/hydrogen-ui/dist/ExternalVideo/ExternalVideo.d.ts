/// <reference types="react" />
import type { ExternalVideo as ExternalVideoType } from '../storefront-api-types';
import type { PartialDeep } from 'type-fest';
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
declare type PropsWeControl = 'src';
/**
 * The `ExternalVideo` component renders an embedded video for the Storefront
 * API's [ExternalVideo object](https://shopify.dev/api/storefront/reference/products/externalvideo).
 */
export declare function ExternalVideo(props: Omit<JSX.IntrinsicElements['iframe'], PropsWeControl> & ExternalVideoProps): JSX.Element;
interface YouTube {
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
declare type VimeoBoolean = 0 | 1 | boolean;
interface Vimeo {
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
export declare function useEmbeddedVideoUrl(url: string, parameters?: YouTube | Vimeo): string;
export declare function addParametersToEmbeddedVideoUrl(url: string, parameters?: YouTube | Vimeo): string;
export {};
