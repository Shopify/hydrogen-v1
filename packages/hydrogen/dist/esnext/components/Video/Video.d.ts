import { shopifyImageLoader } from '../../utilities';
import type { Video as VideoType } from '../../storefront-api-types';
import type { PartialDeep } from 'type-fest';
interface VideoProps {
    /** An object with fields that correspond to the Storefront API's [Video object](https://shopify.dev/api/storefront/latest/objects/video). */
    data: PartialDeep<VideoType>;
    /** An object of image size options for the video's `previewImage`. Uses `shopifyImageLoader` to generate the `poster` URL. */
    previewImageOptions?: Parameters<typeof shopifyImageLoader>[0];
}
/**
 * The `Video` component renders a `video` for the Storefront API's [Video object](https://shopify.dev/api/storefront/reference/products/video).
 */
export declare function Video(props: JSX.IntrinsicElements['video'] & VideoProps): JSX.Element;
export {};
