import { YouTube, Vimeo } from '../../utilities';
import type { ExternalVideo as ExternalVideoType } from '../../storefront-api-types';
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
export {};
