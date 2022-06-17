import { type ElementType } from 'react';
import type { Props } from '../types';
import type { Metafield } from '../../storefront-api-types';
import type { PartialDeep } from 'type-fest';
export interface MetafieldProps<TTag> {
    /** An object with fields that correspond to the Storefront API's [Metafield object](https://shopify.dev/api/storefront/reference/common-objects/metafield). */
    data: PartialDeep<Metafield> | null;
    /** An HTML tag to be rendered as the base element wrapper. The default value varies depending on [metafield.type](https://shopify.dev/apps/metafields/types). */
    as?: TTag;
}
/**
 * The `Metafield` component renders the value of a Storefront
 * API's [Metafield object](https://shopify.dev/api/storefront/reference/common-objects/metafield).
 *
 * Renders a smart default of the Metafield's `value`. For more information, refer to the [Default output](#default-output) section.
 */
export declare function Metafield<TTag extends ElementType>(props: Props<TTag> & MetafieldProps<TTag>): JSX.Element | null;
